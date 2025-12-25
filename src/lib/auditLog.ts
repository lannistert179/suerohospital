import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'publish' 
  | 'unpublish' 
  | 'activate' 
  | 'deactivate'
  | 'login'
  | 'logout';

export type EntityType = 
  | 'doctor' 
  | 'service' 
  | 'news' 
  | 'user';

interface LogAuditParams {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  details?: Json;
}

export async function logAuditEvent({
  action,
  entityType,
  entityId,
  entityName,
  details,
}: LogAuditParams): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Cannot log audit event: No authenticated user');
      return;
    }

    const { error } = await supabase.from('audit_logs').insert([{
      user_id: user.id,
      user_email: user.email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      details,
    }]);
    
    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    console.error('Error logging audit event:', err);
  }
}
