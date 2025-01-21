import React, { useState, useEffect } from 'react';
import { Table } from '../../components/Admin/Table';
import { Pagination } from '../../components/Common/common4All/Pagination';
import Modal from '../../components/Common/common4All/Modal';
import { StatusBadge } from '../../components/Admin/StatusBadge';
import { Eye, XCircle, CheckCircle, Search, Filter, ArrowUpDown } from 'lucide-react';
import InputField from '../../components/Auth/InputField';
import { API } from '../../Config/adminAxios';

const QUESTIONS_PER_PAGE = 6;

interface Answer {
  id: string;
  content: string;
  isBlocked: boolean;
  createdAt: string;
  author: string;
}

interface Question {
  id: string;
  content: string;
  answers: Answer[];
  isBlocked: boolean;
  createdAt: string;
  author: string;
}

const QA_mgt: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'createdAt' | 'answers'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'blocked' | 'active'>('all');
  const [questions, setQuestions] = useState<Question[]>([]); // State to hold fetched questions
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/qa/${filter}`); 
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filterQuestions = (questions: Question[]) => {
    return questions
      .filter((q) =>
        (q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.author.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'all' ||
          (statusFilter === 'blocked' && q.isBlocked) ||
          (statusFilter === 'active' && !q.isBlocked))
      )
      .sort((a, b) => {
        if (sortField === 'createdAt') {
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return sortOrder === 'asc'
            ? a.answers.length - b.answers.length
            : b.answers.length - a.answers.length;
        }
      });
  };

  const toggleQuestionBlock = (questionId: string) => {
    // Implement question block/unblock logic
    console.log('Toggle question block:', questionId);
  };

  const toggleAnswerBlock = (questionId: string, answerId: string) => {
    // Implement answer block/unblock logic
    console.log('Toggle answer block:', questionId, answerId);
  };

  const filteredQuestions = filterQuestions(questions);
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold mb-8">Q&A Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <InputField
              type={'search'}
              placeholder="Search questions or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-gray-400" />
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field as any);
                setSortOrder(order as any);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="answers-desc">Most Answers</option>
              <option value="answers-asc">Least Answers</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <Table headers={['Question', 'Answers', 'Status', 'Actions']}>
            {currentQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="truncate">{question.content}</p>
                    <p className="text-sm text-gray-500">
                      by {question.author} • {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsAnswersModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={16} />
                    View ({question.answers.length})
                  </button>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={question.isBlocked ? 'blocked' : 'active'} />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleQuestionBlock(question.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                      question.isBlocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    {question.isBlocked ? (
                      <>
                        <CheckCircle size={16} />
                        Unblock
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Block
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isAnswersModalOpen}
        onClose={() => setIsAnswersModalOpen(false)}
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Question</h2>
            <p className="text-gray-700 mb-4">{selectedQuestion.content}</p>
            
            <h3 className="text-lg font-semibold">Answers ({selectedQuestion.answers.length})</h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {selectedQuestion.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="p-4 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      by {answer.author} • {new Date(answer.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => toggleAnswerBlock(selectedQuestion.id, answer.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                        answer.isBlocked
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                    >
                      {answer.isBlocked ? (
                        <>
                          <CheckCircle size={14} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Block
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QA_mgt;
