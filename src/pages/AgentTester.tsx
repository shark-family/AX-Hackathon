import React, { useState } from 'react';

function AgentTester() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // API가 반환하는 객체 구조에 맞춰 'data.response'를 사용합니다.
      setResponse(data.response); 
    } catch (e) {
      setError(`요청 실패: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Finance Agent API Tester</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="에이전트에게 질문하기"
          style={{ width: '300px', padding: '8px' }}
          disabled={loading}
        />
        <button type="submit" style={{ padding: '8px 12px', marginLeft: '10px' }} disabled={loading}>
          {loading ? '생각 중...' : '전송'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h2>오류</h2>
          <pre>{error}</pre>
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>에이전트 답변</h2>
          {/* 답변이 Markdown 형식일 수 있으므로 pre 태그로 감싸서 공백을 유지합니다. */}
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AgentTester;
