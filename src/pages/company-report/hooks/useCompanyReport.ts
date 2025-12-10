import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../../../stores/interviewStore";

export const useCompanyReport = () => {
  const navigate = useNavigate();
  const { reportData, summary, setReportData } = useInterviewStore();
  const [isLoading, setIsLoading] = useState(!reportData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (reportData) {
        setIsLoading(false);
        return;
      }
      
      if (!summary.targetCompany || !summary.targetJobTitle) {
        setError("인터뷰 데이터가 부족하여 리포트를 생성할 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        console.log("request 데이터: ", summary);
        const response = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: summary.targetCompany,
            job_role: summary.targetJobTitle,
            skills: summary.skills,
            experiences: summary.achievements,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setReportData(result);
      } catch (err) {
        console.error("Failed to call analyze API:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [summary, reportData, setReportData]);

  return {
    reportData,
    summary,
    isLoading,
    error,
    goBack: () => navigate(-1),
  };
};
