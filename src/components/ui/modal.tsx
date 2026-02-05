
'use client';

import { X } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

export default function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-primary/20 shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </Card>
        </div>
    );
}
