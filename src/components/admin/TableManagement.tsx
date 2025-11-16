import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, QrCode as QrCodeIcon, Edit, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const TableManagement = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: 4
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const { data } = await supabase
      .from('tables')
      .select('*')
      .order('table_number');
    
    if (data) setTables(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const qrCode = `${window.location.origin}/pos?table=${formData.table_number}`;
    
    const { error } = await supabase
      .from('tables')
      .insert({
        table_number: formData.table_number,
        capacity: formData.capacity,
        qr_code: qrCode
      });

    if (error) {
      toast.error('Failed to create table');
    } else {
      toast.success('Table created');
      setShowDialog(false);
      setFormData({ table_number: '', capacity: 4 });
      fetchTables();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this table?')) return;

    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete table');
    } else {
      toast.success('Table deleted');
      fetchTables();
    }
  };

  const showQR = (table: any) => {
    setSelectedTable(table);
    setShowQRDialog(true);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `table-${selectedTable.table_number}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Table Management</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Number</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.table_number}</TableCell>
                <TableCell>{table.capacity} seats</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${table.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {table.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => showQR(table)}>
                      <QrCodeIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(table.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Table Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Table Number</Label>
              <Input
                value={formData.table_number}
                onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Capacity (seats)</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            <Button type="submit" className="w-full">Create Table</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Table {selectedTable?.table_number} QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {selectedTable && (
              <>
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={selectedTable.qr_code}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-sm text-muted-foreground text-center">
                  Scan to order from Table {selectedTable.table_number}
                </p>
                <Button onClick={downloadQR} className="w-full">
                  Download QR Code
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableManagement;
