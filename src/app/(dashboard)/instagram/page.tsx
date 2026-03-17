"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Instagram, ExternalLink, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/products/image-upload";

interface InstaPost {
    id?: string;
    image_url: string;
    caption: string;
    instagram_url: string;
    hashtag: string;
    likes: string;
    display_order: number;
    is_active: boolean;
}

const emptyPost: InstaPost = {
    image_url: "",
    caption: "",
    instagram_url: "",
    hashtag: "",
    likes: "0",
    display_order: 0,
    is_active: true,
};

export default function InstagramPage() {
    const [posts, setPosts] = useState<InstaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<InstaPost>(emptyPost);
    const [saving, setSaving] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/instagram");
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (error) {
            console.error("Failed to fetch Instagram posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleAdd = () => {
        setEditingPost({ ...emptyPost, display_order: posts.length });
        setDialogOpen(true);
    };

    const handleEdit = (post: InstaPost) => {
        setEditingPost({ ...post });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = editingPost.id ? `/api/instagram/${editingPost.id}` : "/api/instagram";
            const method = editingPost.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingPost),
            });

            if (res.ok) {
                setDialogOpen(false);
                fetchPosts();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save post");
            }
        } catch (error) {
            console.error("Failed to save post", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this Instagram post?")) return;
        try {
            const res = await fetch(`/api/instagram/${id}`, { method: "DELETE" });
            if (res.ok) fetchPosts();
            else alert("Failed to delete");
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleToggleActive = async (post: InstaPost) => {
        try {
            const res = await fetch(`/api/instagram/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !post.is_active }),
            });
            if (res.ok) fetchPosts();
        } catch (error) {
            console.error("Failed to toggle", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Instagram className="w-7 h-7 text-pink-500" />
                        Instagram Gallery
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Curate posts for your homepage #VaanraFam section and gallery page
                    </p>
                </div>
                <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Post
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-500">Total Posts</div>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{posts.filter(p => p.is_active).length}</div>
                    <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="text-2xl font-bold text-gray-400">{posts.filter(p => !p.is_active).length}</div>
                    <div className="text-sm text-gray-500">Hidden</div>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Add your first Instagram post to get started</p>
                        <Button onClick={handleAdd} variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add First Post
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className={`group relative rounded-xl overflow-hidden border-2 transition-all ${post.is_active ? "border-transparent hover:border-pink-300" : "border-gray-200 opacity-50"
                                    }`}
                            >
                                <div className="relative aspect-square bg-gray-100">
                                    {post.image_url ? (
                                        <Image
                                            src={post.image_url}
                                            alt={post.caption || "Instagram post"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Instagram className="w-12 h-12" />
                                        </div>
                                    )}

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => handleEdit(post)}>
                                                <Edit2 className="w-3 h-3 mr-1" /> Edit
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={() => handleToggleActive(post)}>
                                                {post.is_active ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                                                {post.is_active ? "Hide" : "Show"}
                                            </Button>
                                        </div>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id!)}>
                                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                                        </Button>
                                    </div>
                                </div>

                                {/* Post info */}
                                <div className="p-3 bg-white">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-pink-500">{post.hashtag || "#vaanra"}</span>
                                        <span className="text-xs text-gray-400">♥ {post.likes}</span>
                                    </div>
                                    {post.caption && (
                                        <p className="text-xs text-gray-600 truncate">{post.caption}</p>
                                    )}
                                    {post.instagram_url && (
                                        <a
                                            href={post.instagram_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <ExternalLink className="w-3 h-3" /> View on Instagram
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            {editingPost.id ? "Edit Post" : "Add Post"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <ImageUpload
                                value={editingPost.image_url ? [editingPost.image_url] : []}
                                onChange={(urls) => setEditingPost(p => ({ ...p, image_url: urls[0] || "" }))}
                            />
                            <Input
                                placeholder="Or paste image URL here..."
                                value={editingPost.image_url}
                                onChange={(e) => setEditingPost(p => ({ ...p, image_url: e.target.value }))}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Instagram Post URL</Label>
                            <Input
                                placeholder="https://www.instagram.com/p/..."
                                value={editingPost.instagram_url}
                                onChange={(e) => setEditingPost(p => ({ ...p, instagram_url: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Hashtag</Label>
                                <Input
                                    placeholder="#vaanra_style"
                                    value={editingPost.hashtag}
                                    onChange={(e) => setEditingPost(p => ({ ...p, hashtag: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Likes</Label>
                                <Input
                                    placeholder="2.4k"
                                    value={editingPost.likes}
                                    onChange={(e) => setEditingPost(p => ({ ...p, likes: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Caption</Label>
                            <Textarea
                                placeholder="What makes this look special?"
                                value={editingPost.caption}
                                onChange={(e) => setEditingPost(p => ({ ...p, caption: e.target.value }))}
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Display Order</Label>
                                <Input
                                    type="number"
                                    value={editingPost.display_order}
                                    onChange={(e) => setEditingPost(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="space-y-2 flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingPost.is_active}
                                        onChange={(e) => setEditingPost(p => ({ ...p, is_active: e.target.checked }))}
                                        className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="text-sm font-medium">Visible on site</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !editingPost.image_url}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                            {saving ? "Saving..." : "Save Post"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
