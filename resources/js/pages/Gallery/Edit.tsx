import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Trash2 } from 'lucide-react';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

interface ImageData {
    virtual_image_id: string;
    real_image_id: string;
}

interface SubAlbumData {
    title: string;
    cover_image_id: string;
    images: ImageData[];
}

interface Album {
    id: number;
    title: string;
    slug: string;
    cover_image_id: string;
    has_sub_albums: boolean;
    order: number;
    is_active: boolean;
    sub_albums: SubAlbumData[];
    images: ImageData[];
}

interface Props {
    album: Album;
}

interface FormData {
    title: string;
    cover_image_id: string;
    has_sub_albums: boolean;
    order: number;
    is_active: boolean;
    sub_albums: SubAlbumData[];
    images: ImageData[];
}

export default function GalleryAlbumEdit({ album }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Gallery', href: '/admin/gallery-albums' },
        { title: 'Edit Album', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: album.title || '',
        cover_image_id: album.cover_image_id || '',
        has_sub_albums: album.has_sub_albums ?? false,
        order: album.order || 0,
        is_active: album.is_active ?? true,
        sub_albums: album.sub_albums || [],
        images: album.images || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/gallery-albums/${album.id}`);
    };

    // Sub-album management
    const addSubAlbum = () => {
        setData('sub_albums', [
            ...data.sub_albums,
            { title: '', cover_image_id: '', images: [] },
        ]);
    };

    const updateSubAlbum = (index: number, field: keyof SubAlbumData, value: any) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[index] = { ...newSubAlbums[index], [field]: value };
        setData('sub_albums', newSubAlbums);
    };

    const removeSubAlbum = (index: number) => {
        setData('sub_albums', data.sub_albums.filter((_, i) => i !== index));
    };

    // Sub-album image management
    const addSubAlbumImage = (subIndex: number) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[subIndex].images.push({ virtual_image_id: '', real_image_id: '' });
        setData('sub_albums', newSubAlbums);
    };

    const updateSubAlbumImage = (
        subIndex: number,
        imgIndex: number,
        field: keyof ImageData,
        value: string
    ) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[subIndex].images[imgIndex][field] = value;
        setData('sub_albums', newSubAlbums);
    };

    const removeSubAlbumImage = (subIndex: number, imgIndex: number) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[subIndex].images = newSubAlbums[subIndex].images.filter((_, i) => i !== imgIndex);
        setData('sub_albums', newSubAlbums);
    };

    // Direct image management
    const addImage = () => {
        setData('images', [...data.images, { virtual_image_id: '', real_image_id: '' }]);
    };

    const updateImage = (index: number, field: keyof ImageData, value: string) => {
        const newImages = [...data.images];
        newImages[index][field] = value;
        setData('images', newImages);
    };

    const removeImage = (index: number) => {
        setData('images', data.images.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Album - ${album.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Gallery Album</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter album title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Current slug: <code>{album.slug}</code>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive) *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cover_image_id"
                                        value={data.cover_image_id}
                                        onChange={(e) => setData('cover_image_id', e.target.value)}
                                        placeholder="Enter Google Drive file ID"
                                    />
                                    <IdPickerButton onPick={(id) => setData('cover_image_id', id)} />
                                </div>
                                {errors.cover_image_id && (
                                    <p className="text-sm text-destructive">{errors.cover_image_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="has_sub_albums"
                                    checked={data.has_sub_albums}
                                    onCheckedChange={(checked) => {
                                        setData('has_sub_albums', checked);
                                        // Clear opposite content type
                                        if (checked) {
                                            setData('images', []);
                                        } else {
                                            setData('sub_albums', []);
                                        }
                                    }}
                                />
                                <Label htmlFor="has_sub_albums">Has Sub-Albums</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sub-Albums Section */}
                    {data.has_sub_albums && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Sub-Albums</CardTitle>
                                    <Button type="button" onClick={addSubAlbum} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Sub-Album
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.sub_albums.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No sub-albums added yet. Click "Add Sub-Album" to get started.
                                    </p>
                                ) : (
                                    data.sub_albums.map((subAlbum, subIndex) => (
                                        <Card key={subIndex}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base">
                                                        Sub-Album {subIndex + 1}
                                                    </CardTitle>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSubAlbum(subIndex)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Title *</Label>
                                                    <Input
                                                        value={subAlbum.title}
                                                        onChange={(e) =>
                                                            updateSubAlbum(subIndex, 'title', e.target.value)
                                                        }
                                                        placeholder="Enter sub-album title"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Cover Image ID *</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={subAlbum.cover_image_id}
                                                            onChange={(e) =>
                                                                updateSubAlbum(
                                                                    subIndex,
                                                                    'cover_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Google Drive file ID"
                                                        />
                                                        <IdPickerButton
                                                            onPick={(id) =>
                                                                updateSubAlbum(
                                                                    subIndex,
                                                                    'cover_image_id',
                                                                    id
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* Sub-Album Images */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Images</Label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addSubAlbumImage(subIndex)}
                                                        >
                                                            <Plus className="mr-2 h-3 w-3" />
                                                            Add Image
                                                        </Button>
                                                    </div>
                                                    {subAlbum.images.length === 0 ? (
                                                        <p className="text-xs text-muted-foreground text-center py-4">
                                                            No images added
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {subAlbum.images.map((img, imgIndex) => (
                                                                <Card key={imgIndex}>
                                                                    <CardContent className="pt-4 space-y-2">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-xs font-medium">
                                                                                Image {imgIndex + 1}
                                                                            </span>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removeSubAlbumImage(
                                                                                        subIndex,
                                                                                        imgIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs">
                                                                                Virtual Image ID
                                                                            </Label>
                                                                            <div className="flex gap-2">
                                                                                <Input
                                                                                    value={img.virtual_image_id}
                                                                                    onChange={(e) =>
                                                                                        updateSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex,
                                                                                            'virtual_image_id',
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                    placeholder="Optional"
                                                                                />
                                                                                <IdPickerButton
                                                                                    onPick={(id) =>
                                                                                        updateSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex,
                                                                                            'virtual_image_id',
                                                                                            id
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs">
                                                                                Real Image ID
                                                                            </Label>
                                                                            <div className="flex gap-2">
                                                                                <Input
                                                                                    value={img.real_image_id}
                                                                                    onChange={(e) =>
                                                                                        updateSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex,
                                                                                            'real_image_id',
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                    placeholder="Optional"
                                                                                />
                                                                                <IdPickerButton
                                                                                    onPick={(id) =>
                                                                                        updateSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex,
                                                                                            'real_image_id',
                                                                                            id
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Direct Images Section */}
                    {!data.has_sub_albums && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Images</CardTitle>
                                    <Button type="button" onClick={addImage} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Image
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.images.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No images added yet. Click "Add Image" to get started.
                                    </p>
                                ) : (
                                    data.images.map((img, index) => (
                                        <Card key={index}>
                                            <CardContent className="pt-4 space-y-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium">
                                                        Image {index + 1}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Virtual Image ID</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={img.virtual_image_id}
                                                            onChange={(e) =>
                                                                updateImage(
                                                                    index,
                                                                    'virtual_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                        />
                                                        <IdPickerButton
                                                            onPick={(id) =>
                                                                updateImage(index, 'virtual_image_id', id)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Real Image ID</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={img.real_image_id}
                                                            onChange={(e) =>
                                                                updateImage(
                                                                    index,
                                                                    'real_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                        />
                                                        <IdPickerButton
                                                            onPick={(id) =>
                                                                updateImage(index, 'real_image_id', id)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Album'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
