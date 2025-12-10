import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../../../stores/interviewStore";

export const useResume = () => {
  const navigate = useNavigate();
  const { resumePdfUrl, resumePdfBlob, summary } = useInterviewStore();
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "HWP" | "DOCX">("PDF");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!resumePdfUrl && !resumePdfBlob) {
      navigate("/interview");
    }
  }, [resumePdfUrl, resumePdfBlob, navigate]);

  useEffect(() => {
    return () => {
      if (resumePdfUrl) {
        URL.revokeObjectURL(resumePdfUrl);
      }
    };
  }, [resumePdfUrl]);

  const changeScale = (delta: number) => {
    setScale((prev) => Math.min(2, Math.max(0.6, parseFloat((prev + delta).toFixed(2)))));
  };

  const handleDownload = () => {
    const blobToDownload = resumePdfBlob;

    if (!blobToDownload && !resumePdfUrl) {
      alert('다운로드할 파일이 없습니다.');
      return;
    }

    try {
      if (blobToDownload) {
        const url = window.URL.createObjectURL(blobToDownload);
        const link = document.createElement("a");
        link.href = url;
        link.download = `resume_${summary.name || "지원자"}.pdf`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } else if (resumePdfUrl) {
        const link = document.createElement("a");
        link.href = resumePdfUrl;
        link.download = `resume_${summary.name || "지원자"}.pdf`;
        link.target = "_blank";
        link.rel = "noopener";
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return {
    resumePdfUrl,
    resumePdfBlob,
    summary,
    selectedFormat,
    setSelectedFormat,
    scale,
    changeScale,
    handleDownload,
    navigateToCompanyReport: () => navigate("/company-report"),
  };
};
