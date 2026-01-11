import React, { useState } from 'react';
import { X, Plus, Minus, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InspectionBookingModal = ({ inspector, property, onClose, onBook }) => {
  const [checklistItems, setChecklistItems] = useState([
    'Check plumbing systems',
    'Inspect electrical wiring',
    'Examine structural integrity'
  ]);
  const [newItem, setNewItem] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const addChecklistItem = () => {
    if (newItem.trim()) {
      setChecklistItems([...checklistItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeChecklistItem = (index) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleBook = () => {
    const bookingData = {
      inspector,
      property,
      checklist: checklistItems,
      specialRequests,
      fee: inspector.fee
    };
    onBook(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Book Inspection</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Inspector Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">
                    {inspector.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{inspector.name}</h3>
                  <p className="text-sm text-muted-foreground">{inspector.location}</p>
                  <p className="text-lg font-bold text-green-600">{inspector.fee}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Property to Inspect</h3>
              <p className="text-sm">{property.title}</p>
              <p className="text-sm text-muted-foreground">{property.location}</p>
            </CardContent>
          </Card>

          {/* Custom Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Inspection Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add specific items you want the inspector to check
              </p>
              
              <div className="space-y-2">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    <span className="flex-1 text-sm">{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add inspection item..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                />
                <Button onClick={addChecklistItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          <div>
            <Label htmlFor="requests">Additional Special Requests</Label>
            <Textarea
              id="requests"
              placeholder="Any specific concerns or areas of focus..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
            />
          </div>

          {/* Booking Summary */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Inspection Fee:</span>
                  <span className="font-semibold">{inspector.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checklist Items:</span>
                  <span>{checklistItems.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="text-green-600">Secure Escrow</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleBook} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Book Inspection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionBookingModal;