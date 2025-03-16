
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { WeightRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar,
} from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { ArrowDown, ArrowRight, ArrowUp, Calendar as CalendarIcon, Plus, Trash2, Weight as WeightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import WeightChart from '@/components/WeightChart';

const Weight = () => {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState<Date>(new Date());
  const [newNotes, setNewNotes] = useState('');

  // Load weight records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('weightRecords');
    
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        // Convert date strings back to Date objects
        const formattedRecords = parsedRecords.map((r: any) => ({
          ...r,
          date: new Date(r.date),
        }));
        setRecords(formattedRecords);
      } catch (e) {
        console.error('Error parsing weight records:', e);
      }
    } else {
      // Create sample data if no records exist
      createSampleData();
    }
  }, []);

  // Save weight records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weightRecords', JSON.stringify(records));
  }, [records]);

  const createSampleData = () => {
    const today = new Date();
    const sampleRecords: WeightRecord[] = [];
    
    // Generate sample data for the last 30 days
    for (let i = 30; i >= 0; i -= 5) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Start from 80kg and gradually decrease
      const baseWeight = 78;
      const randomVariation = (Math.random() * 2 - 1); // Random variation between -1 and +1
      const weight = baseWeight - (i / 30) * 2 + randomVariation;
      
      sampleRecords.push({
        id: uuidv4(),
        weight: parseFloat(weight.toFixed(1)),
        date,
        notes: '',
      });
    }
    
    setRecords(sampleRecords);
  };

  const handleAddRecord = () => {
    // Validate weight input
    if (!newWeight || isNaN(parseFloat(newWeight)) || parseFloat(newWeight) <= 0) {
      toast.error('Por favor, insira um peso válido');
      return;
    }
    
    // Create new record
    const newRecord: WeightRecord = {
      id: uuidv4(),
      weight: parseFloat(parseFloat(newWeight).toFixed(1)),
      date: newDate,
      notes: newNotes.trim() ? newNotes : undefined,
    };
    
    // Add record and sort by date
    const updatedRecords = [...records, newRecord].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    
    setRecords(updatedRecords);
    toast.success('Registro adicionado com sucesso!');
    
    // Reset form
    setNewWeight('');
    setNewDate(new Date());
    setNewNotes('');
    setShowAddDialog(false);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast.success('Registro excluído com sucesso!');
  };

  // Calculate weight changes
  const getWeightChange = (current: number, previous: number | null) => {
    if (previous === null) return null;
    
    const change = current - previous;
    if (Math.abs(change) < 0.05) return null;
    
    return {
      value: change.toFixed(1),
      icon: change < 0 ? ArrowDown : ArrowUp,
      className: change < 0 ? 'text-green-500' : 'text-red-500',
    };
  };

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Acompanhamento de Peso</h1>
              <p className="text-muted-foreground mt-1">
                Registre seu peso e acompanhe seu progresso
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo registro
            </Button>
          </div>
          
          <div className="space-y-8">
            {/* Weight Chart */}
            {records.length > 1 && (
              <WeightChart records={records} />
            )}
            
            {/* Weight Records Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <WeightIcon className="h-5 w-5 mr-2 text-primary" />
                  Histórico de registros
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie seus registros de peso
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sortedRecords.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Peso (kg)</TableHead>
                          <TableHead>Variação</TableHead>
                          <TableHead className="hidden md:table-cell">Observações</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedRecords.map((record, index) => {
                          const prevRecord = index < sortedRecords.length - 1 ? sortedRecords[index + 1] : null;
                          const weightChange = getWeightChange(record.weight, prevRecord?.weight || null);
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {format(record.date, 'dd/MM/yyyy')}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {record.weight}
                              </TableCell>
                              <TableCell>
                                {weightChange ? (
                                  <div className={cn("flex items-center", weightChange.className)}>
                                    <weightChange.icon className="h-4 w-4 mr-1" />
                                    {weightChange.value} kg
                                  </div>
                                ) : (
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                {record.notes || '-'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteRecord(record.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <WeightIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Nenhum registro de peso encontrado
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      Adicione seu primeiro registro de peso para começar a acompanhar seu progresso
                    </p>
                    <Button variant="default" size="sm" onClick={() => setShowAddDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar registro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Add Weight Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo registro</DialogTitle>
            <DialogDescription>
              Registre seu peso atual
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex: 75.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDate ? format(newDate, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newDate}
                    onSelect={(date) => date && setNewDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ex: Após treino de perna"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddRecord}>
              Salvar registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Weight;
