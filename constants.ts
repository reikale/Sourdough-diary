
import { BakeEntry } from './types';

export const COLORS = {
  peach: '#ffe5d9',
  mint: '#d8e2dc',
  lilac: '#ece4db',
  lemon: '#ffcad4',
  sky: '#f4acb7',
  text: '#3d3d3d',
};

export const MOCK_BAKES: BakeEntry[] = [
  {
    id: '1',
    batchNumber: 42,
    title: 'Sunny Sunday Sourdough',
    date: '2023-10-22',
    intro: 'The perfect crust achieved! After weeks of experimenting with steam, this one finally sang.',
    kitchenTemp: 24,
    percentages: {
      flour: 500,
      water: 375,
      starter: 100,
      salt: 10
    },
    coverImage: 'https://picsum.photos/seed/sourdough1/800/600',
    timeline: [
      { id: 's1', time: '08:00', action: 'Feed Starter', notes: 'Starter doubled by 12:00' },
      { id: 's2', time: '12:30', action: 'Autolyse', notes: 'Mixing flour and water' },
      { id: 's3', time: '13:30', action: 'Add Starter & Salt', notes: 'Incorporated gently' },
      { id: 's4', time: '14:00', action: 'Bulk Fermentation Start', notes: '3 sets of coil folds every 30 mins' },
      { id: 's5', time: '20:00', action: 'Shape & Cold Proof', notes: 'Put in fridge overnight' }
    ]
  },
  {
    id: '2',
    batchNumber: 43,
    title: 'The Rye Experiment',
    date: '2023-11-05',
    intro: 'Swapped 20% bread flour for whole rye. The depth of flavor is incredible, though the dough was much stickier than expected.',
    kitchenTemp: 22,
    percentages: {
      flour: 400,
      water: 320,
      starter: 80,
      salt: 8
    },
    coverImage: 'https://picsum.photos/seed/sourdough2/800/600',
    timeline: [
      { id: 't1', time: '09:00', action: 'Mix All', notes: 'Sticky dough!' },
      { id: 't2', time: '10:00', action: 'First Stretch', notes: 'Feels strong' }
    ]
  }
];
