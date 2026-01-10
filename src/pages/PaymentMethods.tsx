import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cards] = useState([
    { id: '1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: '2', type: 'Mastercard', last4: '8888', expiry: '08/26', isDefault: false },
  ]);

  return (
    <Layout activeTab="profile">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Payment Methods</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary rounded-lg text-primary hover:bg-primary/5 mb-4">
            <Plus size={20} />
            <span className="font-medium">Add New Card</span>
          </button>

          <div className="space-y-3">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard size={24} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">{card.type} •••• {card.last4}</p>
                    <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                  </div>
                  {card.isDefault && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">Default</span>
                  )}
                </div>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentMethods;