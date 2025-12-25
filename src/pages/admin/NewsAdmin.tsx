import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Pencil, Trash2, Loader2, Calendar as CalendarIcon, Eye, EyeOff, GripVertical, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import ImageUpload from '@/components/admin/ImageUpload';
import GalleryUpload from '@/components/admin/GalleryUpload';
import { logAuditEvent } from '@/lib/auditLog';
import { getErrorMessage } from '@/lib/errorHandler';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CATEGORIES = [
  { value: 'news', label: 'News', color: 'bg-blue-500/10 text-blue-600' },
  { value: 'announcement', label: 'Announcement', color: 'bg-purple-500/10 text-purple-600' },
  { value: 'event', label: 'Event', color: 'bg-green-500/10 text-green-600' },
  { value: 'health-tip', label: 'Health Tip', color: 'bg-amber-500/10 text-amber-600' },
  { value: 'update', label: 'Update', color: 'bg-cyan-500/10 text-cyan-600' },
] as const;

interface NewsArticle {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  display_order: number | null;
  category: string | null;
  gallery_images: string[] | null;
}

function getCategoryInfo(category: string | null) {
  return CATEGORIES.find(c => c.value === category) || CATEGORIES[0];
}

interface SortableArticleCardProps {
  article: NewsArticle;
  onEdit: (article: NewsArticle) => void;
  onDelete: (article: NewsArticle) => void;
  isDeleting: boolean;
}

function SortableArticleCard({ article, onEdit, onDelete, isDeleting }: SortableArticleCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        !article.is_published ? 'border-dashed' : '',
        isDragging ? 'shadow-lg ring-2 ring-primary' : ''
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {article.is_published ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    <Eye className="h-3 w-3" />
                    Published
                  </span>
                ) : article.published_at && new Date(article.published_at) > new Date() ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">
                    <Clock className="h-3 w-3" />
                    Scheduled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    <EyeOff className="h-3 w-3" />
                    Draft
                  </span>
                )}
                <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded", getCategoryInfo(article.category).color)}>
                  <Tag className="h-3 w-3" />
                  {getCategoryInfo(article.category).label}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  {article.published_at 
                    ? format(new Date(article.published_at), 'MMM d, yyyy HH:mm')
                    : format(new Date(article.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              {article.excerpt && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
              )}
            </div>
          </div>
          {article.image_url && (
            <div className="h-16 w-24 rounded bg-muted overflow-hidden flex-shrink-0">
              <img src={article.image_url} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 ml-8">
          <Button variant="outline" size="sm" onClick={() => onEdit(article)}>
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(article)}
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    is_published: false,
    published_at: null as Date | null,
    published_time: '12:00',
    category: 'news',
    gallery_images: [] as string[],
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as NewsArticle[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Combine date and time for published_at
      let publishedAt: string | null = null;
      if (data.is_published && data.published_at) {
        const [hours, minutes] = data.published_time.split(':').map(Number);
        const publishDate = new Date(data.published_at);
        publishDate.setHours(hours, minutes, 0, 0);
        publishedAt = publishDate.toISOString();
      } else if (data.is_published) {
        publishedAt = new Date().toISOString();
      }

      // Get max display_order
      const { data: maxOrderData } = await supabase
        .from('news')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      const newOrder = (maxOrderData?.display_order ?? 0) + 1;

      const { data: insertedData, error } = await supabase.from('news').insert({
        title: data.title,
        content: data.content || null,
        excerpt: data.excerpt || null,
        image_url: data.image_url || null,
        author_id: user?.id,
        is_published: data.is_published,
        published_at: publishedAt,
        display_order: newOrder,
        category: data.category,
        gallery_images: data.gallery_images.length > 0 ? data.gallery_images : null,
      }).select().single();
      if (error) throw error;
      return { insertedData, formData: data };
    },
    onSuccess: (result) => {
      logAuditEvent({
        action: 'create',
        entityType: 'news',
        entityId: result.insertedData?.id,
        entityName: result.formData.title,
        details: { is_published: result.formData.is_published },
      });
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Article created successfully' });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: getErrorMessage(error) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, wasPublished }: { id: string; data: typeof formData; wasPublished: boolean }) => {
      // Combine date and time for published_at
      let publishedAt: string | null = null;
      if (data.is_published && data.published_at) {
        const [hours, minutes] = data.published_time.split(':').map(Number);
        const publishDate = new Date(data.published_at);
        publishDate.setHours(hours, minutes, 0, 0);
        publishedAt = publishDate.toISOString();
      } else if (data.is_published && !wasPublished) {
        publishedAt = new Date().toISOString();
      }

      const updateData: Record<string, unknown> = {
        title: data.title,
        content: data.content || null,
        excerpt: data.excerpt || null,
        image_url: data.image_url || null,
        is_published: data.is_published,
        category: data.category,
        gallery_images: data.gallery_images.length > 0 ? data.gallery_images : null,
      };
      
      // Update published_at if date was set or when first publishing
      if (publishedAt) {
        updateData.published_at = publishedAt;
      }
      
      const { error } = await supabase.from('news').update(updateData).eq('id', id);
      if (error) throw error;
      return { id, data, wasPublished };
    },
    onSuccess: (result) => {
      const action = result.data.is_published && !result.wasPublished ? 'publish' : 'update';
      logAuditEvent({
        action,
        entityType: 'news',
        entityId: result.id,
        entityName: result.data.title,
        details: { is_published: result.data.is_published },
      });
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Article updated successfully' });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: getErrorMessage(error) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (article: NewsArticle) => {
      const { error } = await supabase.from('news').delete().eq('id', article.id);
      if (error) throw error;
      return article;
    },
    onSuccess: (article) => {
      logAuditEvent({
        action: 'delete',
        entityType: 'news',
        entityId: article.id,
        entityName: article.title,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Article deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: getErrorMessage(error) });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (reorderedArticles: NewsArticle[]) => {
      const updates = reorderedArticles.map((article, index) => 
        supabase.from('news').update({ display_order: index + 1 }).eq('id', article.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Articles reordered successfully' });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: getErrorMessage(error) });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && articles) {
      const oldIndex = articles.findIndex((a) => a.id === active.id);
      const newIndex = articles.findIndex((a) => a.id === over.id);
      const reordered = arrayMove(articles, oldIndex, newIndex);
      
      // Optimistically update the UI
      queryClient.setQueryData(['admin-news'], reordered);
      
      // Persist to database
      reorderMutation.mutate(reordered);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      is_published: false,
      published_at: null,
      published_time: '12:00',
      category: 'news',
      gallery_images: [],
    });
    setEditingArticle(null);
    setIsOpen(false);
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    
    // Parse existing published_at date and time
    let publishedDate: Date | null = null;
    let publishedTime = '12:00';
    if (article.published_at) {
      const date = new Date(article.published_at);
      publishedDate = date;
      publishedTime = format(date, 'HH:mm');
    }
    
    setFormData({
      title: article.title,
      content: article.content || '',
      excerpt: article.excerpt || '',
      image_url: article.image_url || '',
      is_published: article.is_published,
      published_at: publishedDate,
      published_time: publishedTime,
      category: article.category || 'news',
      gallery_images: Array.isArray(article.gallery_images) ? article.gallery_images : [],
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      updateMutation.mutate({ 
        id: editingArticle.id, 
        data: formData, 
        wasPublished: editingArticle.is_published 
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <Breadcrumbs />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">News & Announcements</h1>
            <p className="text-muted-foreground mt-1">Manage hospital news and announcements. Drag to reorder.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingArticle ? 'Edit Article' : 'Create New Article'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    placeholder="A short summary of the article..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    placeholder="Full article content..."
                  />
                </div>
                <ImageUpload
                  label="Featured Image"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="news"
                />
                
                <GalleryUpload
                  label="Gallery Images"
                  value={formData.gallery_images}
                  onChange={(urls) => setFormData({ ...formData, gallery_images: urls })}
                  folder="news/gallery"
                  maxImages={10}
                />
                
                {/* Publish Date & Time Picker */}
                <div className="space-y-2">
                  <Label>Publish Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !formData.published_at && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.published_at 
                            ? format(formData.published_at, "PPP")
                            : "Select publish date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.published_at || undefined}
                          onSelect={(date) => setFormData({ ...formData, published_at: date || null })}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={formData.published_time}
                        onChange={(e) => setFormData({ ...formData, published_time: e.target.value })}
                        className="w-32"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set when this article should appear. Articles are ordered by display order (drag & drop), then by publish date.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {formData.is_published ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <Label htmlFor="is_published" className="cursor-pointer">
                        {formData.is_published ? 'Published' : 'Draft'}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.is_published ? 'Visible to the public' : 'Only visible to admins'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingArticle ? 'Update Article' : 'Create Article'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : articles && articles.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={articles.map(a => a.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {articles.map((article) => (
                  <SortableArticleCard
                    key={article.id}
                    article={article}
                    onEdit={handleEdit}
                    onDelete={(a) => deleteMutation.mutate(a)}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No articles found. Create your first article to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}