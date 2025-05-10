
"use client";
import React, { useState, useCallback } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import type { HabitDataForAI } from '@/types';
import { getPersonalizedInsights, PersonalizedInsightsOutput } from '@/ai/flows/personalized-insights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Zap, Loader2, AlertTriangle } from 'lucide-react';
import LucideIcon from '@/components/icons/LucideIcon';

const InsightsGenerator: React.FC = () => {
  const { habits, logs, getStreakCount } = useHabits();
  const [insights, setInsights] = useState<PersonalizedInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] useState<string | null>(null);

  const prepareAiInput = useCallback((): HabitDataForAI[] => {
    return habits.map(habit => {
      const habitLogs = logs.filter(log => log.habitId === habit.id);
      const activitiesForAI = habitLogs.map(log => {
        // Use the comment from the last activity of the day as a representative comment
        const lastActivityWithComment = [...log.activities].reverse().find(act => act.comment && act.comment.trim() !== '');
        return {
          date: log.date,
          count: log.activities.length,
          comment: lastActivityWithComment?.comment,
        };
      });

      return {
        name: habit.name,
        isNegative: habit.isNegative,
        activities: activitiesForAI,
        streak: getStreakCount(habit.id),
      };
    });
  }, [habits, logs, getStreakCount]);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);

    if (habits.length === 0) {
        setError("Please add some habits and log activities to get insights.");
        setIsLoading(false);
        return;
    }

    const aiInputHabits = prepareAiInput();
    
    // Check if there's any meaningful activity data
    const hasActivityData = aiInputHabits.some(h => h.activities.length > 0);
    if (!hasActivityData) {
        setError("Please log some activities for your habits to generate insights.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await getPersonalizedInsights({ habits: aiInputHabits });
      setInsights(result);
    } catch (e) {
      console.error("Error generating insights:", e);
      setError("Failed to generate insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          Personalized Insights
        </CardTitle>
        <CardDescription>
          Discover patterns and get suggestions to improve your habits based on your activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Generating insights, please wait...</p>
          </div>
        )}

        {!isLoading && insights && insights.insights.length > 0 && (
          <div className="space-y-4">
            {insights.insights.map((insight, index) => {
              const habit = habits.find(h => h.name === insight.habitName);
              return (
                <Card key={index} className="bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      {habit && (
                        <div
                          className="p-1.5 rounded-md flex items-center justify-center w-7 h-7 mr-2"
                          style={{ backgroundColor: habit.color }}
                        >
                          <LucideIcon name={habit.symbol} size={16} className="text-white" />
                        </div>
                      )}
                      {insight.habitName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><strong className="text-primary">Insight:</strong> {insight.insight}</p>
                    <p><strong className="text-accent-foreground">Suggestion:</strong> {insight.suggestion}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {!isLoading && insights && insights.insights.length === 0 && (
             <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>No Specific Insights Generated</AlertTitle>
                <AlertDescription>
                    The AI couldn't generate specific new insights at this time. This might be due to limited data or current patterns.
                    Keep tracking your habits, and check back later!
                </AlertDescription>
            </Alert>
        )}

        {!isLoading && !insights && !error && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Click the button below to generate your personalized habit insights.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={isLoading || habits.length === 0} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Zap className="mr-2 h-4 w-4" />
          )}
          Generate Insights
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsightsGenerator;
