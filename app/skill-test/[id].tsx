import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { colors } from '@/constants/colors';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react-native';

export default function SkillTestScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { skillTests, submitTestAnswer, completeSkillTest } = useStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [actionAnswer, setActionAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const test = skillTests.find(t => t.id === id);
  
  useEffect(() => {
    if (!test) {
      router.replace('/skill-tests');
    }
  }, [test, router]);

  if (!test) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  const handleNextQuestion = () => {
    if (currentQuestion.type === 'reflection') {
      if (!reflectionAnswer.trim()) return;
      submitTestAnswer(currentQuestion.id, reflectionAnswer);
      setReflectionAnswer('');
    } else if (currentQuestion.type === 'action') {
      if (!actionAnswer.trim()) return;
      submitTestAnswer(currentQuestion.id, actionAnswer);
      setActionAnswer('');
    }

    if (isLastQuestion) {
      handleCompleteTest();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectOption = (option: string) => {
    submitTestAnswer(currentQuestion.id, option);
  };

  const handleCompleteTest = () => {
    setIsSubmitting(true);
    
    // Calculate a score based on completed questions
    const answeredQuestions = test.questions.filter(q => q.userAnswer);
    const score = Math.round((answeredQuestions.length / test.questions.length) * 100);
    
    completeSkillTest(test.id, score);
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace(`/test-results/${test.id}`);
    }, 1000);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  currentQuestion.userAnswer === option && styles.selectedOption
                ]}
                onPress={() => handleSelectOption(option)}
              >
                <Text 
                  style={[
                    styles.optionText,
                    currentQuestion.userAnswer === option && styles.selectedOptionText
                  ]}
                >
                  {option}
                </Text>
                {currentQuestion.userAnswer === option && (
                  <CheckCircle size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'reflection':
        return (
          <TextInput
            style={styles.textInput}
            value={reflectionAnswer}
            onChangeText={setReflectionAnswer}
            placeholder="Type your answer here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
        );
      
      case 'action':
        return (
          <View>
            <TextInput
              style={styles.textInput}
              value={actionAnswer}
              onChangeText={setActionAnswer}
              placeholder="Describe what you did and how it went..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentQuestion.type === 'multiple-choice') {
      return !currentQuestion.userAnswer;
    } else if (currentQuestion.type === 'reflection') {
      return !reflectionAnswer.trim();
    } else if (currentQuestion.type === 'action') {
      return !actionAnswer.trim();
    }
    return false;
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: `Test: ${test.skillArea}`,
          headerBackTitle: 'Back'
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </Text>
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {renderQuestion()}
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft size={20} color={currentQuestionIndex === 0 ? colors.textSecondary : colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.navButton, 
              styles.nextButton,
              isNextDisabled() && styles.disabledButton
            ]}
            onPress={handleNextQuestion}
            disabled={isNextDisabled() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? 'Complete' : 'Next'}
                </Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    height: 120,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: colors.card,
    width: 48,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});