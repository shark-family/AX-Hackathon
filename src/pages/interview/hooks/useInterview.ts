import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../../../stores/interviewStore";
import { generateResumeData, normalizeResumeData, generateSelfIntroFromInterview } from "../../../services/llmService";
import { generateResumePDF } from "../../../services/apiService";
import type { ResumeData } from "../../../types/resume";

const steps = ["기본 정보", "경력 사항", "개인의 강점", "희망 직무", "최종 확인"];

export const useInterview = () => {
  const navigate = useNavigate();
  const { messages, addMessage, isLoadingSummary, isThinking, summary, hasFinishedInterview, setResumePdfUrl, setResumePdfBlob } = useInterviewStore();
  const [inputValue, setInputValue] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const questionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialMessage = useRef(false);
  const isSendingRef = useRef(false);

  useEffect(() => {
    useInterviewStore.setState({ totalQuestions: steps.length });
  }, []);

  const userMessages = messages.filter((m) => m.role === "user");
  const currentStep = Math.min(userMessages.length, steps.length - 1);
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const getPromptForStep = (step: number) => {
    const name = summary.name || displayName || "지원자님";
    if (step === 0)
      return "안녕하세요! 인터뷰를 시작하겠습니다. 먼저 성함과 지원을 원하시는 회사 및 직무를 말씀해주시겠어요?";
    if (step === 1) return "이전에는 어떤 회사에서 업무를 하셨나요? 또, 어떤 성과를 내셨나요?";
    if (step === 2)
      return `${name}님은 어떤 기술을 가장 잘 활용하시나요? 또는 어떤 부분에서 강점을 갖고 계신가요? 관련 수상이나 자격증도 어필해주세요!`;
    if (step === 3) {
      const targetCompany = summary.targetCompany;
      const targetJobTitle = summary.targetJobTitle;
      const questionText = targetCompany && targetJobTitle
        ? `${targetCompany} ${targetJobTitle}`
        : targetCompany || targetJobTitle || name;
      return `${questionText}에서 무슨 일을 하고 싶으세요? 구체적으로 말씀해주시면 보다 구체적인 피드백이 가능합니다!`;
    }
    return "";
  };

  useEffect(() => {
    if (!hasInitialMessage.current) {
      const assistantMessages = messages.filter((m) => m.role === "assistant");
      if (assistantMessages.length === 0 && messages.length === 0) {
        hasInitialMessage.current = true;
        addMessage({
          role: "assistant",
          content: getPromptForStep(0),
        });
      }
    }
  }, []);

  useEffect(() => {
    if (hasFinishedInterview) {
      return;
    }

    if (questionTimeoutRef.current) {
      clearTimeout(questionTimeoutRef.current);
      questionTimeoutRef.current = null;
    }

    const assistantMessages = messages.filter((m) => m.role === "assistant");
    
    if (
      !isLoadingSummary &&
      !isThinking &&
      userMessages.length > 0 &&
      userMessages.length < steps.length &&
      assistantMessages.length <= userMessages.length
    ) {
      const nextStep = userMessages.length;
      const nextPrompt = getPromptForStep(nextStep);
      
      if (nextPrompt) {
        questionTimeoutRef.current = setTimeout(() => {
          addMessage({
            role: "assistant",
            content: nextPrompt,
          });
          questionTimeoutRef.current = null;
        }, 500);
      }
    }

    return () => {
      if (questionTimeoutRef.current) {
        clearTimeout(questionTimeoutRef.current);
      }
    };
  }, [isLoadingSummary, isThinking, messages, userMessages.length, summary, hasFinishedInterview, addMessage]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoadingSummary || isThinking || isSendingRef.current) return;

    isSendingRef.current = true;

    try {
      const nameMatch = trimmed.match(/(?:이름은|이름이|제\s*이름은|저는|저)\s*([가-힣]{2,4})/);
      if (nameMatch?.[1] && !displayName) {
        setDisplayName(nameMatch[1]);
      }

      setInputValue("");
      await addMessage({
        role: "user",
        content: trimmed,
      });
    } finally {
      isSendingRef.current = false;
    }
  };

  const handleGenerateResume = async () => {
    if (isGeneratingResume) return;
    
    setIsGeneratingResume(true);
    try {
      const currentSummary = useInterviewStore.getState().summary;
      const currentMessages = useInterviewStore.getState().messages;
      
      const defaultResumeData: Partial<ResumeData> = {
        name: currentSummary.name || "김매경",
        birthdate: "1966년 3월 24일",
        address: "서울특별시 중구 퇴계로 190 (필동1가)",
        photo_path: "senior_photo.png",
        phone: "010-2000-2000",
        email: "sciver@mk.co.kr",
        emergency_contact: "(관계: 배우자) 010-2000-2114",
        education: [
          { institution: "서울중앙고등학교", period: "1982.03 -- 1985.02" },
          { institution: "경기대학교", degree: "경영학과", period: "1986.03 -- 1990.02" }
        ],
        experience: [
          { company: "OO은행", role: "영업지원 / 고객상담 담당", period: "1991.03 -- 2001.02", location: "서울 지역" },
          { company: "OO캐피탈", role: "사무관리 / 채권관리", period: "2001.04 -- 2008.12", location: "서울 본사" },
          { company: "OO자산관리", role: "시설·안전관리 / 입주민 응대", period: "2009.02 -- 2022.12", location: "서울·경기 근린시설" }
        ],
        certifications: [
          { title: "주택관리사(보)", issuer: "한국산업인력공단", date: "2023.12" },
          { title: "소방안전관리자 2급", issuer: "한국소방안전원", date: "2024.01" },
          { title: "조경기능사", issuer: "한국산업인력공단", date: "2023.06" },
          { title: "컴퓨터활용능력 2급", issuer: "대한상공회의소", date: "2022.08" },
          { title: "TOEIC", score: "650점", date: "2022.05" }
        ],
      };
      
      console.log("이력서 데이터 생성 중...");
      const rawResumeData = await generateResumeData(currentMessages, currentSummary, defaultResumeData);
      
      console.log("이력서 데이터 정규화 중...");
      const resumeData = normalizeResumeData(rawResumeData, currentSummary);
      
      console.log("자기소개서 생성 중...");
      const selfIntro = await generateSelfIntroFromInterview(currentSummary);
      
      const resumeDataWithSelfIntro = {
        ...resumeData,
        self_intro: selfIntro,
        cover_letter: [
          { question: selfIntro.q1_question, answer: selfIntro.q1_answer },
          { question: selfIntro.q2_question, answer: selfIntro.q2_answer },
          { question: selfIntro.q3_question, answer: selfIntro.q3_answer },
        ],
      };
      
      console.log("생성된 이력서 데이터:", resumeDataWithSelfIntro);

      console.log("PDF 생성 중...");
      const pdfBlob = await generateResumePDF(resumeDataWithSelfIntro);
      
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setResumePdfUrl(pdfUrl);
      setResumePdfBlob(pdfBlob);
      
      console.log("PDF 생성 완료!");
      
      navigate("/company-report");
    } catch (error) {
      console.error("이력서 생성 실패:", error);
      alert("이력서 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGeneratingResume(false);
    }
  };

  return {
    messages,
    isLoadingSummary,
    isThinking,
    summary,
    steps,
    inputValue,
    setInputValue,
    displayName,
    isGeneratingResume,
    currentStep,
    progressPercent,
    handleSend,
    handleGenerateResume,
    isSending: isSendingRef.current
  };
};
