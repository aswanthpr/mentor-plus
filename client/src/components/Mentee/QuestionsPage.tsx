import React, { useState } from 'react';


interface Question {
  id: number;
  heading: string;
  explanation: string;
  tags: string[];
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ heading: '', explanation: '', tags: [] as string[] });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'answers' | null>(null);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      setCurrentTags((prevTags) => [...prevTags, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    const question = { ...newQuestion, id: newId, tags: currentTags };
    setQuestions((prev) => [...prev, question]);
    setModalType(null);
    setNewQuestion({ heading: '', explanation: '', tags: [] });
    setCurrentTags([]);
  };

  const handleEditQuestion = () => {
    if (!editingQuestion) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === editingQuestion.id ? { ...editingQuestion, tags: currentTags } : q))
    );
    setModalType(null);
    setEditingQuestion(null);
    setCurrentTags([]);
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setModalType('edit');
    setCurrentTags(question.tags);
  };

  const renderTags = (tags: string[]) => (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <span key={index} className="tag">
          {tag} <button onClick={() => handleRemoveTag(tag)}>x</button>
        </span>
      ))}
    </div>
  );

  const currentPageQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="questions-page mt-16">
      <div className="header">
        <h1>Write Your Questions</h1>
        <button className="add-button" onClick={() => setModalType('add')}>
          Add Question
        </button>
      </div>
      <hr />
      <div className="questions-list">
        {currentPageQuestions.map((q) => (
          <div key={q.id} className="question-card">
            <h2>{q.heading}</h2>
            <p>{q.explanation}</p>
            {renderTags(q.tags)}
            <button onClick={() => openEditModal(q)}>Edit Question</button>
            <button onClick={() => setModalType('answers')}>Answer</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => (p * itemsPerPage < questions.length ? p + 1 : p))}
          disabled={currentPage * itemsPerPage >= questions.length}
        >
          Next
        </button>
      </div>

      {modalType && (
        <div className="modal">
          <div className="modal-content">
            {modalType === 'add' || modalType === 'edit' ? (
              <>
                <h2>{modalType === 'add' ? 'Add Question' : 'Edit Question'}</h2>
                <input
                  type="text"
                  placeholder="Heading"
                  value={modalType === 'add' ? newQuestion.heading : editingQuestion?.heading || ''}
                  onChange={(e) =>
                    modalType === 'add'
                      ? setNewQuestion((prev) => ({ ...prev, heading: e.target.value }))
                      : setEditingQuestion((prev) => (prev ? { ...prev, heading: e.target.value } : null))
                  }
                />
                <textarea
                  placeholder="Explanation"
                  value={modalType === 'add' ? newQuestion.explanation : editingQuestion?.explanation || ''}
                  onChange={(e) =>
                    modalType === 'add'
                      ? setNewQuestion((prev) => ({ ...prev, explanation: e.target.value }))
                      : setEditingQuestion((prev) => (prev ? { ...prev, explanation: e.target.value } : null))
                  }
                ></textarea>
                <input
                  type="text"
                  placeholder="Add tags"
                  onKeyDown={handleAddTag}
                />
                {renderTags(currentTags)}
                <button onClick={modalType === 'add' ? handleAddQuestion : handleEditQuestion}>
                  {modalType === 'add' ? 'Submit' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <h2>Answers</h2>
                <div className="answers-container">Scrollable answers content here</div>
              </>
            )}
            <button onClick={() => setModalType(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;