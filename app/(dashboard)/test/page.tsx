'use client';

import React, { useEffect } from 'react';
import { createSwapy } from '@/config';
const DEFAULT = {
  '1': 'a',
  '3': 'c',
  '4': 'd',
  '2': null,
};

function A() {
  return (
    <div className='bg-blue-500 p-4 rounded-lg shadow-md' data-swapy-item='a'>
      <div className='cursor-move' data-swapy-handle>
        <div className='text-white font-bold'>A</div>
      </div>
    </div>
  );
}

function C() {
  return (
    <div className='bg-green-500 p-4 rounded-lg shadow-md' data-swapy-item='c'>
      <div className='text-white font-bold'>C</div>
    </div>
  );
}

function D() {
  return (
    <div className='bg-yellow-500 p-4 rounded-lg shadow-md' data-swapy-item='d'>
      <div className='text-white font-bold'>D</div>
    </div>
  );
}

function getItemById(itemId: 'a' | 'c' | 'd' | null) {
  switch (itemId) {
    case 'a':
      return <A />;
    case 'c':
      return <C />;
    case 'd':
      return <D />;
  }
}

export default function TestPage() {
  const slotItems: Record<string, 'a' | 'c' | 'd' | null> =
    localStorage.getItem('slotItem')
      ? JSON.parse(localStorage.getItem('slotItem')!)
      : DEFAULT;

  useEffect(() => {
    const container = document.querySelector('.container')!;
    const swapy = createSwapy(container, {
      swapMode: 'hover',
      continuousMode: false,
    });
    swapy.onSwap(({ data }) => {
      console.log('swap', data);
      localStorage.setItem('slotItem', JSON.stringify(data.object));
    });

    swapy.onSwapEnd(({ data }) => {
      console.log('end', data);
    });

    swapy.onSwapStart(() => {
      console.log('start');
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  return (
    <div className='container max-w-3xl mx-auto p-8  rounded-xl shadow-lg'>
      <div className='slot mb-4 h-24 bg-white rounded-lg shadow' data-swapy-slot='1'>
        {getItemById(slotItems['1'])}
      </div>
      <div className='second-row flex gap-4 mb-4'>
        <div className='slot flex-1 h-24 bg-white rounded-lg shadow' data-swapy-slot='2'>
          {getItemById(slotItems['2'])}
        </div>
        <div className='slot flex-1 h-24 bg-white rounded-lg shadow' data-swapy-slot='3'>
          {getItemById(slotItems['3'])}
        </div>
      </div>
      <div className='slot h-24 bg-white rounded-lg shadow' data-swapy-slot='4'>
        {getItemById(slotItems['4'])}
      </div>
    </div>
  );
}
