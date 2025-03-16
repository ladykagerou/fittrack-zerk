
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Calculator, Flame, Scale, User } from 'lucide-react';
import { toast } from 'sonner';
import { CalorieCalculation } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const Calories = () => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<CalorieCalculation[]>([]);

  // Carregar cálculos salvos
  useEffect(() => {
    const saved = localStorage.getItem('calorieCalculations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Converter string de data para objeto Date
        const formatted = parsed.map((calc: any) => ({
          ...calc,
          date: new Date(calc.date),
        }));
        setSavedCalculations(formatted);
      } catch (e) {
        console.error('Erro ao carregar cálculos salvos:', e);
      }
    }
  }, []);

  // Salvar cálculos
  useEffect(() => {
    if (savedCalculations.length > 0) {
      localStorage.setItem('calorieCalculations', JSON.stringify(savedCalculations));
    }
  }, [savedCalculations]);

  const calculateBMR = () => {
    // Fórmula de Harris-Benedict
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);
    const ageVal = parseInt(age);
    
    if (gender === 'male') {
      return 88.362 + (13.397 * weightVal) + (4.799 * heightVal) - (5.677 * ageVal);
    } else {
      return 447.593 + (9.247 * weightVal) + (3.098 * heightVal) - (4.330 * ageVal);
    }
  };

  const calculateTDEE = (bmr: number) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    return bmr * activityMultipliers[activityLevel];
  };

  const calculateTargetCalories = (tdee: number) => {
    const goalMultipliers = {
      lose: 0.8, // Déficit de 20%
      maintain: 1,
      gain: 1.15, // Superávit de 15%
    };
    
    return tdee * goalMultipliers[goal];
  };

  const calculateMacros = (targetCalories: number) => {
    // Baseado no objetivo
    let proteinPerKg, fatsPercentage;
    
    if (goal === 'lose') {
      proteinPerKg = 2.2; // Maior proteína para preservar massa magra
      fatsPercentage = 0.25;
    } else if (goal === 'gain') {
      proteinPerKg = 1.8;
      fatsPercentage = 0.3;
    } else {
      proteinPerKg = 1.6;
      fatsPercentage = 0.3;
    }
    
    const weightVal = parseFloat(weight);
    const protein = weightVal * proteinPerKg;
    const proteinCalories = protein * 4;
    
    const fatsCalories = targetCalories * fatsPercentage;
    const fats = fatsCalories / 9;
    
    const carbsCalories = targetCalories - proteinCalories - fatsCalories;
    const carbs = carbsCalories / 4;
    
    return {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    };
  };

  const handleCalculate = () => {
    // Validação básica
    if (!age || !weight || !height) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }
    
    if (isNaN(parseFloat(age)) || isNaN(parseFloat(weight)) || isNaN(parseFloat(height))) {
      toast.error('Por favor, insira valores numéricos válidos!');
      return;
    }
    
    // Cálculos
    const bmr = calculateBMR();
    const tdee = calculateTDEE(bmr);
    const targetCalories = calculateTargetCalories(tdee);
    const macros = calculateMacros(targetCalories);
    
    // Atualizar o resultado
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      ...macros,
    });
    
    // Salvar o cálculo
    const newCalculation: CalorieCalculation = {
      id: uuidv4(),
      date: new Date(),
      gender,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      activityLevel,
      goal,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
    };
    
    setSavedCalculations([newCalculation, ...savedCalculations]);
    toast.success('Cálculo realizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calculadora de Calorias</h1>
              <p className="text-muted-foreground mt-1">
                Calcule suas necessidades calóricas diárias
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  Dados para o cálculo
                </CardTitle>
                <CardDescription>
                  Preencha seus dados para calcular suas necessidades calóricas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Gênero</Label>
                      <RadioGroup
                        value={gender}
                        onValueChange={(val) => setGender(val as 'male' | 'female')}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">Feminino</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Idade (anos)</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Ex: 30"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 70.5"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Altura (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Ex: 175"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activity">Nível de Atividade</Label>
                      <Select
                        value={activityLevel}
                        onValueChange={(val) => setActivityLevel(val as any)}
                      >
                        <SelectTrigger id="activity">
                          <SelectValue placeholder="Selecione seu nível de atividade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                          <SelectItem value="light">Levemente ativo (1-3 dias por semana)</SelectItem>
                          <SelectItem value="moderate">Moderadamente ativo (3-5 dias por semana)</SelectItem>
                          <SelectItem value="active">Muito ativo (6-7 dias por semana)</SelectItem>
                          <SelectItem value="very_active">Extremamente ativo (atletas, 2x por dia)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal">Objetivo</Label>
                      <Select
                        value={goal}
                        onValueChange={(val) => setGoal(val as any)}
                      >
                        <SelectTrigger id="goal">
                          <SelectValue placeholder="Selecione seu objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose">Perder peso</SelectItem>
                          <SelectItem value="maintain">Manter peso</SelectItem>
                          <SelectItem value="gain">Ganhar peso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleCalculate}
                    className="w-full"
                  >
                    Calcular
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-primary" />
                  Resultado
                </CardTitle>
                <CardDescription>
                  Suas necessidades calóricas diárias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Metabolismo Basal (BMR)</div>
                        <div className="text-2xl font-bold">{result.bmr} kcal</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Calorias necessárias em repouso completo
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Gasto Energético Total (TDEE)</div>
                        <div className="text-2xl font-bold">{result.tdee} kcal</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Calorias necessárias para manter seu peso atual
                        </div>
                      </div>
                      
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <div className="text-sm font-medium mb-1">Calorias Diárias Recomendadas</div>
                        <div className="text-3xl font-bold text-primary">{result.targetCalories} kcal</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Baseado no seu objetivo de {goal === 'lose' ? 'perder' : goal === 'gain' ? 'ganhar' : 'manter'} peso
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Distribuição de Macronutrientes Sugerida</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-blue-600 mb-1">Proteínas</div>
                          <div className="text-xl font-bold">{result.protein}g</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(result.protein * 4)} kcal
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <div className="text-sm text-amber-600 mb-1">Carboidratos</div>
                          <div className="text-xl font-bold">{result.carbs}g</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(result.carbs * 4)} kcal
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-sm text-green-600 mb-1">Gorduras</div>
                          <div className="text-xl font-bold">{result.fats}g</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(result.fats * 9)} kcal
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Calculator className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Preencha o formulário e clique em calcular para ver seus resultados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calories;
