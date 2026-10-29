import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';
import { storage } from '../lib/localStorage';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function VirtualDoctor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hello! I'm your virtual health assistant. I can help you with health-related questions, provide fitness advice, and answer questions about your diet and workouts. How can I help you today?",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getHealthContext = () => {
    if (!user) return '';
    
    const profile = profileAPI.get(user.id);
    const healthMetrics = storage.getHealthMetrics(user.id);
    const dietLogs = storage.getDietLogs(user.id);
    const workoutPlans = storage.getWorkoutPlans(user.id);
    
    let context = '';
    
    if (profile) {
      context += `User Profile:\n`;
      if (profile.fullName) context += `- Name: ${profile.fullName}\n`;
      if (profile.height) context += `- Height: ${profile.height} cm\n`;
      if (profile.weight) context += `- Weight: ${profile.weight} kg\n`;
      if (profile.goal) context += `- Goal: ${profile.goal}\n`;
      if (profile.activityLevel) context += `- Activity Level: ${profile.activityLevel}\n`;
    }
    
    if (healthMetrics.length > 0) {
      const latest = healthMetrics[healthMetrics.length - 1];
      context += `\nLatest Health Metrics:\n`;
      context += `- Heart Rate: ${latest.heartRate} bpm\n`;
      context += `- Blood Pressure: ${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic} mmHg\n`;
      context += `- Oxygen Level: ${latest.oxygenLevel}%\n`;
      context += `- Steps: ${latest.steps}\n`;
      context += `- Water Intake: ${latest.waterIntake} ml\n`;
    }
    
    if (dietLogs.length > 0) {
      const recent = dietLogs.slice(-5);
      context += `\nRecent Diet Logs: ${recent.length} entries\n`;
    }
    
    if (workoutPlans.length > 0) {
      context += `\nWorkout Plans: ${workoutPlans.length} plans created\n`;
    }
    
    return context;
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const healthContext = getHealthContext();
    const lowerMessage = userMessage.toLowerCase();
    
    // Health-related responses
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
      return "I understand you're experiencing discomfort. While I can provide general information, it's important to consult with a healthcare professional for persistent pain or serious symptoms. For minor aches, rest, hydration, and gentle stretching may help. If the pain persists or worsens, please seek medical attention.";
    }
    
    if (lowerMessage.includes('weight') || lowerMessage.includes('lose') || lowerMessage.includes('gain')) {
      const profile = user ? profileAPI.get(user.id) : undefined;
      if (profile?.weight && profile?.height) {
        const bmi = profile.weight / ((profile.height / 100) ** 2);
        return `Based on your profile (${profile.weight}kg, ${profile.height}cm), your BMI is ${bmi.toFixed(1)}. For healthy weight management, focus on a balanced diet with proper portion control, regular exercise, and adequate sleep. Aim for gradual changes of 0.5-1kg per week. Remember, sustainable weight management is about lifestyle changes, not quick fixes.`;
      }
      return "For healthy weight management, I recommend: 1) Balanced nutrition with proper portion control, 2) Regular physical activity (150 minutes of moderate exercise per week), 3) Adequate sleep (7-9 hours), 4) Stay hydrated, and 5) Manage stress. Would you like specific recommendations based on your profile?";
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
      const profile = user ? profileAPI.get(user.id) : undefined;
      if (profile?.goal) {
        return `Based on your goal (${profile.goal}), I recommend focusing on exercises that align with your objectives. For weight loss: cardio and strength training. For muscle gain: progressive resistance training. For general health: a mix of cardio, strength, and flexibility exercises. Check your Workout Plans page for personalized recommendations!`;
      }
      return "Regular exercise is essential for good health. I recommend: 1) 150 minutes of moderate aerobic activity per week, 2) Strength training 2-3 times per week, 3) Flexibility exercises, and 4) Rest days for recovery. Start gradually and increase intensity over time. What's your fitness goal?";
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return "A balanced diet is key to good health. Focus on: 1) Whole foods (fruits, vegetables, lean proteins, whole grains), 2) Proper portion sizes, 3) Stay hydrated (8-10 glasses of water daily), 4) Limit processed foods and added sugars, 5) Regular meal timing. Track your meals in the Diet Tracking page to monitor your nutrition. What specific dietary questions do you have?";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('fatigue')) {
      return "Quality sleep is crucial for health. Recommendations: 1) Aim for 7-9 hours per night, 2) Maintain a consistent sleep schedule, 3) Create a relaxing bedtime routine, 4) Avoid screens 1 hour before bed, 5) Keep your bedroom cool and dark, 6) Limit caffeine and alcohol before bedtime. Poor sleep can affect your workouts and recovery.";
    }
    
    if (lowerMessage.includes('heart') || lowerMessage.includes('cardiac') || lowerMessage.includes('cardiovascular')) {
      const healthMetrics = user ? storage.getHealthMetrics(user.id) : [];
      if (healthMetrics.length > 0) {
        const latest = healthMetrics[healthMetrics.length - 1];
        return `Your latest heart rate reading is ${latest.heartRate} bpm. Normal resting heart rate is 60-100 bpm. To improve cardiovascular health: 1) Regular aerobic exercise, 2) Maintain healthy weight, 3) Eat heart-healthy foods, 4) Manage stress, 5) Avoid smoking, 6) Regular health checkups. If you have concerns about your heart rate, consult a healthcare professional.`;
      }
      return "Cardiovascular health is important. To maintain a healthy heart: 1) Regular aerobic exercise (150 minutes/week), 2) Eat a balanced diet rich in fruits, vegetables, and whole grains, 3) Maintain healthy weight, 4) Manage stress, 5) Get regular checkups, 6) Avoid smoking. What specific questions do you have about heart health?";
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('hydration') || lowerMessage.includes('drink')) {
      const healthMetrics = user ? storage.getHealthMetrics(user.id) : [];
      if (healthMetrics.length > 0) {
        const latest = healthMetrics[healthMetrics.length - 1];
        return `Your current water intake is ${latest.waterIntake} ml. General recommendation is 2-3 liters (2000-3000ml) per day, but this varies based on activity level, climate, and individual needs. Increase intake during exercise and in hot weather. Signs of good hydration: clear urine, no excessive thirst.`;
      }
      return "Proper hydration is essential. Recommendations: 1) Drink 2-3 liters of water daily, 2) Increase intake during exercise, 3) Drink water throughout the day, not just when thirsty, 4) Monitor urine color (pale yellow is ideal), 5) Include water-rich foods in your diet. Track your water intake in the Dashboard!";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm here to help with your health and fitness questions. You can ask me about exercise, nutrition, sleep, weight management, or any health-related topics. How can I assist you today?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I can help you with: 1) Health and fitness advice, 2) Nutrition and diet questions, 3) Exercise recommendations, 4) Weight management guidance, 5) General wellness tips, 6) Questions about your tracked data. I use your profile information, health metrics, diet logs, and workout plans to provide personalized advice. What would you like to know?";
    }
    
    // Default response
    return "Thank you for your question. I'm here to provide general health and fitness information based on your profile and tracked data. For specific medical concerns, please consult with a healthcare professional. Is there a particular health or fitness topic you'd like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🩺 Virtual Health Assistant</h1>
        <p className="text-gray-600">
          Ask me anything about your health, fitness, nutrition, or workouts. I'll provide personalized advice based on your profile and tracked data.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[calc(100vh-250px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-indigo-600' 
                    : 'bg-green-100'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask a health or fitness question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Ask about exercise, nutrition, sleep, weight management, or your health metrics
          </p>
        </div>
      </div>
    </div>
  );
}

