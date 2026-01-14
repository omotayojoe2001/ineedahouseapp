import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function AdminCleanup() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllListings();
  }, []);

  const fetchAllListings = async () => {
    setLoading(true);
    try {
      console.log('Fetching all listings...');
      const [props, shortlets, sales, services, shops, events] = await Promise.all([
        supabase.from('properties').select('id, title, category, created_at'),
        supabase.from('shortlets').select('id, title, created_at'),
        supabase.from('sale_properties').select('id, title, created_at'),
        supabase.from('services').select('id, title, created_at'),
        supabase.from('shops').select('id, title, created_at'),
        supabase.from('event_centers').select('id, title, created_at'),
      ]);

      console.log('Properties:', props.data?.length);
      console.log('Shortlets:', shortlets.data?.length);
      console.log('Sales:', sales.data?.length);
      console.log('Services:', services.data?.length);
      console.log('Shops:', shops.data?.length);
      console.log('Events:', events.data?.length);

      const all = [
        ...(props.data || []).map(p => ({ ...p, table: 'properties', type: 'Property' })),
        ...(shortlets.data || []).map(p => ({ ...p, table: 'shortlets', type: 'Shortlet' })),
        ...(sales.data || []).map(p => ({ ...p, table: 'sale_properties', type: 'Sale' })),
        ...(services.data || []).map(p => ({ ...p, table: 'services', type: 'Service' })),
        ...(shops.data || []).map(p => ({ ...p, table: 'shops', type: 'Shop' })),
        ...(events.data || []).map(p => ({ ...p, table: 'event_centers', type: 'Event' })),
      ];

      console.log('Total listings:', all.length);
      setListings(all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string, table: string) => {
    if (!confirm('Delete this listing?')) return;
    
    try {
      console.log('Deleting:', id, 'from', table);
      const { error, data } = await supabase.from(table).delete().eq('id', id).select();
      console.log('Delete result:', { error, data });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Item not found, try to find it in other tables
        console.log('Item not found in', table, '- searching other tables...');
        const tables = ['properties', 'shortlets', 'sale_properties', 'services', 'shops', 'event_centers'];
        
        for (const t of tables) {
          if (t === table) continue;
          const { data: found } = await supabase.from(t).select('id').eq('id', id).single();
          if (found) {
            console.log('Found in', t, '- deleting from there instead');
            const { error: delError } = await supabase.from(t).delete().eq('id', id);
            if (!delError) {
              setListings(prev => prev.filter(l => l.id !== id));
              toast.success(`Deleted from ${t}`);
              return;
            }
          }
        }
        
        toast.error('Item not found in any table - removing from list');
        setListings(prev => prev.filter(l => l.id !== id));
        fetchAllListings(); // Refresh to get accurate data
        return;
      }
      
      setListings(prev => prev.filter(l => l.id !== id));
      toast.success("Deleted successfully");
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || "Failed to delete");
    }
  };

  const deleteSeedData = async () => {
    if (!confirm('Delete ALL SEED DATA? This will remove all demo listings.')) return;
    
    try {
      const results = await Promise.all([
        supabase.from('properties').delete().eq('user_id', null),
        supabase.from('shortlets').delete().eq('user_id', null),
        supabase.from('sale_properties').delete().eq('user_id', null),
        supabase.from('services').delete().eq('user_id', null),
        supabase.from('shops').delete().eq('user_id', null),
        supabase.from('event_centers').delete().eq('user_id', null),
      ]);
      console.log('Delete results:', results);
      toast.success('Seed data deleted');
      fetchAllListings();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete seed data');
    }
  };

  const deleteAll = async (table: string) => {
    if (!confirm(`Delete ALL from ${table}?`)) return;
    
    try {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      
      setListings(prev => prev.filter(l => l.table !== table));
      toast.success(`All ${table} deleted`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete all");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Cleanup</h1>
        
        <div className="flex gap-4 mb-8">
          <Button onClick={deleteSeedData} variant="destructive" className="bg-red-600">Delete All Seed Data</Button>
          <Button onClick={() => deleteAll('properties')} variant="destructive">Delete All Properties</Button>
          <Button onClick={() => deleteAll('shortlets')} variant="destructive">Delete All Shortlets</Button>
          <Button onClick={() => deleteAll('sale_properties')} variant="destructive">Delete All Sales</Button>
          <Button onClick={() => deleteAll('services')} variant="destructive">Delete All Services</Button>
          <Button onClick={() => deleteAll('shops')} variant="destructive">Delete All Shops</Button>
          <Button onClick={() => deleteAll('event_centers')} variant="destructive">Delete All Events</Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-t">
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{listing.type}</span>
                    </td>
                    <td className="p-4">{listing.title}</td>
                    <td className="p-4 text-sm text-gray-600">{new Date(listing.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      <Button 
                        onClick={() => deleteListing(listing.id, listing.table)} 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
