import os
import shutil
import uuid
import subprocess
import jinja2
from pathlib import Path
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Resume PDF Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # 나중에 프론트 도메인만 넣고 싶으면 여기 수정
    allow_credentials=True,
    allow_methods=["*"],      # OPTIONS, POST 등 모두 허용
    allow_headers=["*"],
)

# --- 설정 ---
TEMPLATE_FILENAME = 'senior_template.tex'
BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = BASE_DIR / TEMPLATE_FILENAME

# xelatex 설치 확인
if shutil.which("xelatex") is None:
    raise RuntimeError("❌ 서버에 'xelatex'가 설치되어 있지 않습니다.")

# 요청으로 받을 JSON 데이터 구조 정의 (필요에 따라 구체화 가능)
class ResumeData(BaseModel):
    # 예: name: str, experience: list 등 구체적으로 적어도 되지만
    # 유연성을 위해 딕셔너리 전체를 받도록 설정
    data: Dict[str, Any]

def clean_up_temp_dir(temp_dir: Path):
    """작업이 끝난 후 임시 디렉토리 삭제"""
    try:
        shutil.rmtree(temp_dir)
        print(f"🧹 청소 완료: {temp_dir}")
    except Exception as e:
        print(f"⚠️ 청소 실패: {e}")

@app.post("/generate-pdf")
async def generate_pdf_endpoint(request: ResumeData, background_tasks: BackgroundTasks):
    """
    JSON 데이터를 받아 PDF를 생성하고 반환합니다.
    """
    # 1. 고유 작업 ID 생성 및 임시 디렉토리 생성
    job_id = str(uuid.uuid4())
    temp_dir = BASE_DIR / "temp_jobs" / job_id
    temp_dir.mkdir(parents=True, exist_ok=True)

    # 출력 파일 경로 설정
    output_tex = temp_dir / "resume.tex"
    output_pdf = temp_dir / "resume.pdf"
    
    try:
        # 2. Jinja2 환경 설정 (LaTeX 태그 충돌 방지)
        latex_jinja_env = jinja2.Environment(
            block_start_string=r'\BLOCK{',
            block_end_string='}',
            variable_start_string=r'\VAR{',
            variable_end_string='}',
            comment_start_string=r'\#{',
            comment_end_string='}',
            line_statement_prefix='%%',
            line_comment_prefix='%#',
            trim_blocks=True,
            autoescape=False,
            loader=jinja2.FileSystemLoader(str(BASE_DIR))
        )

        # 3. 템플릿 렌더링
        try:
            template = latex_jinja_env.get_template(TEMPLATE_FILENAME)
            # request.data 딕셔너리를 풀어서 템플릿에 전달
            rendered_tex = template.render(**request.data)
            
            with open(output_tex, 'w', encoding='utf-8') as f:
                f.write(rendered_tex)

            # ⬇️ 여기 추가: 사진 파일을 임시 폴더로 복사
            photo_path = request.data.get("photo_path")
            if photo_path:
                src = BASE_DIR / photo_path         # 예: generate-resume/senior_photo.png
                dst = temp_dir / Path(photo_path).name  # 예: temp_jobs/<uuid>/senior_photo.png
                if src.exists():
                    shutil.copy(src, dst)
                else:
                    print(f"⚠️ 사진 파일을 찾을 수 없습니다: {src}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"템플릿 렌더링 실패: {str(e)}")

        # 4. PDF 컴파일 (xelatex)
        # cwd=temp_dir 옵션을 주어 모든 보조 파일(.aux, .log)이 임시 폴더 안에 생기게 함
        cmd = ['xelatex', '-interaction=nonstopmode', 'resume.tex']
        
        process = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=temp_dir, # 작업 디렉토리를 임시 폴더로 변경
            timeout=30    # 30초 이상 걸리면 타임아웃
        )

        if process.returncode != 0:
            # 에러 로그 읽기
            log_file = temp_dir / "resume.log"
            error_msg = "PDF 컴파일 실패"
            if log_file.exists():
                with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                    error_msg += f": {''.join(lines[-10:])}" # 마지막 10줄만 포함
            
            print(process.stdout.decode('utf-8', errors='ignore')) # 서버 로그에 출력
            raise HTTPException(status_code=500, detail=error_msg)

        if not output_pdf.exists():
             raise HTTPException(status_code=500, detail="PDF 파일이 생성되지 않았습니다.")

        # 5. 파일 반환 및 백그라운드 청소 등록
        # FileResponse가 전송된 후 background_tasks가 실행되어 폴더를 삭제함
        background_tasks.add_task(clean_up_temp_dir, temp_dir)

        return FileResponse(
            path=output_pdf, 
            filename=f"resume_{job_id}.pdf",
            media_type='application/pdf'
        )

    except HTTPException:
        # HTTP 예외 발생 시에는 바로 폴더 정리 후 에러 리턴
        clean_up_temp_dir(temp_dir)
        raise
    except Exception as e:
        clean_up_temp_dir(temp_dir)
        raise HTTPException(status_code=500, detail=f"서버 내부 오류: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # 파일 이름인 "api_main"으로 변경
    uvicorn.run("api_main:app", host="0.0.0.0", port=8000, reload=True)