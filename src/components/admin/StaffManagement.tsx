import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('*, profiles(full_name, phone)')
      .order('created_at', { ascending: false });
    
    if (data) setStaff(data);
  };

  const removeStaff = async (id: string) => {
    if (!confirm('Remove this staff member?')) return;

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to remove staff');
    } else {
      toast.success('Staff removed');
      fetchStaff();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.profiles?.full_name || 'N/A'}</TableCell>
                <TableCell>{member.profiles?.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className="capitalize">{member.role}</Badge>
                </TableCell>
                <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {member.role !== 'owner' && (
                    <Button variant="destructive" size="sm" onClick={() => removeStaff(member.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffManagement;
