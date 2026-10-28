import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, CheckCircle2, Heart, 
  Send, Copy, Layout, LayoutGrid, LayoutTemplate, Camera, Grid2X2,
  Check, Trash2, Download, Plus, Minus
} from 'lucide-react';

export default function WeddingStudioPortal() {
  const [activeTab, setActiveTab] = useState('admin');
  const [photos, setPhotos] = useState([]);
  
  const tabs = [
    { id: 'admin', label: 'Admin (Upload)', icon: Upload },
    { id: 'client', label: 'Klien (Pilih)', icon: Heart },
    { id: 'editor', label: 'Editor (Lightroom)', icon: Camera },
    { id: 'collage', label: 'Kolase Sosmed', icon: Layout },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 font-sans selection:bg-rose-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('admin')}>
              <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-serif italic text-xl">
                E
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-wide text-gray-900">Éternité</h1>
                <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">Wedding Studio</p>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1 bg-gray-50/80 p-1 rounded-full border border-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100/50' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex px-4 py-2 space-x-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'admin' && <AdminView photos={photos} setPhotos={setPhotos} />}
        {activeTab === 'client' && <ClientView photos={photos} setPhotos={setPhotos} />}
        {activeTab === 'editor' && <EditorView photos={photos} />}
        {activeTab === 'collage' && <CollageView photos={photos} />}
      </main>
    </div>
  );
}

/* =========================================
   1. ADMIN VIEW (UPLOAD)
   ========================================= */
function AdminView({ photos, setPhotos }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleFiles = (files) => {
    const newPhotos = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isSelected: false,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const clearAll = () => {
    photos.forEach(p => URL.revokeObjectURL(p.url)); // Free memory
    setPhotos([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-3">Workspace Admin</h2>
        <p className="text-gray-500">Unggah foto-foto raw/hasil foto dari sesi wedding. Memori lokal digunakan untuk mempercepat proses tanpa upload ke server.</p>
      </div>

      <div 
        className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ${
          isDragging ? 'border-gray-900 bg-gray-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <div className="w-20 h-20 mb-6 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-900" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tarik & Lepas Foto Di Sini</h3>
        <p className="text-gray-500 text-sm mb-6">Atau klik tombol di bawah</p>
        
        <label className="cursor-pointer bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg">
          <span className="font-medium text-sm tracking-wide">Pilih File Foto</span>
          <input 
            type="file" multiple accept="image/*" 
            onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {photos.length > 0 && (
        <div className="pt-8">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-serif text-gray-900">Total Diunggah ({photos.length})</h3>
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Bersihkan Data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Yakin?</span>
                <button onClick={clearAll} className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">Ya, Hapus</button>
                <button onClick={() => setShowClearConfirm(false)} className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Batal</button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative border border-gray-100">
                <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
   2. CLIENT VIEW (SELECTION)
   ========================================= */
function ClientView({ photos, setPhotos }) {
  const selectedPhotos = photos.filter(p => p.isSelected);
  const selectedCount = selectedPhotos.length;

  const toggleSelection = (id) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, isSelected: !p.isSelected } : p));
  };

  const sendToWhatsApp = () => {
    if (selectedCount === 0) return;
    const listNames = selectedPhotos.map(p => p.name).join('\n');
    const messageText = `Halo Admin Éternité Studio, saya sudah memilih foto wedding. Berikut daftarnya:\n\n${listNames}`;
    // CRITICAL FIX: URL Exact Formatting for WhatsApp
    window.open('https://wa.me/6281243369250?text=' + encodeURIComponent(messageText), '_blank');
  };

  if (photos.length === 0) return <EmptyState message="Belum ada foto yang diunggah oleh admin." icon={ImageIcon} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-3">Pilihan Klien</h2>
        <p className="text-gray-500">Pilih foto terbaik Anda, lalu kirim daftar namanya otomatis ke WhatsApp Admin kami.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            onClick={() => toggleSelection(photo.id)}
            className={`relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
              photo.isSelected ? 'ring-4 ring-gray-900 ring-offset-2' : 'hover:opacity-90'
            }`}
          >
            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className={`absolute inset-0 bg-black/30 transition-opacity ${photo.isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            
            <div className="absolute top-4 right-4 z-10">
              <button className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                photo.isSelected ? 'bg-white text-rose-500 scale-110 shadow-lg' : 'bg-black/20 text-white border border-white/30'
              }`}>
                <Heart className={`w-5 h-5 ${photo.isSelected ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
               <span className="text-xs text-white/90 drop-shadow-md font-medium">{photo.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
        <div className="bg-gray-900 text-white p-2 pl-6 rounded-full shadow-2xl flex items-center justify-between border border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex w-6 h-6 items-center justify-center bg-white/20 rounded-full text-xs font-bold">{selectedCount}</span>
            <span className="text-sm font-medium">Terpilih</span>
          </div>
          <button 
            onClick={sendToWhatsApp}
            disabled={selectedCount === 0}
            className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Kirim ke WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   3. EDITOR VIEW (LIGHTROOM)
   ========================================= */
function EditorView({ photos }) {
  const selectedPhotos = photos.filter(p => p.isSelected);
  const [copied, setCopied] = useState(false);

  const copyForLightroom = () => {
    const filenames = selectedPhotos.map(p => p.name).join(', ');
    navigator.clipboard.writeText(filenames);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (selectedPhotos.length === 0) return <EmptyState message="Klien belum memilih foto apa pun." icon={CheckCircle2} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-serif text-gray-900 mb-2 flex items-center gap-3">
            <Camera className="w-6 h-6 text-gray-900" /> Mode Editor Lightroom
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Total <strong>{selectedPhotos.length} foto</strong> terpilih. Salin daftar nama file untuk di-<em>paste</em> pada <strong>Text Filter</strong> (Contains All) di module Library Adobe Lightroom.
          </p>
        </div>
        <button 
          onClick={copyForLightroom}
          className={`flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 ${
            copied ? 'bg-green-500 text-white shadow-green-500/25' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Tersalin ke Clipboard!' : 'Copy Nama File'}
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
        {selectedPhotos.map((photo) => (
          <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative border border-gray-100">
            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-white truncate w-full block">{photo.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================
   4. COLLAGE VIEW (IMPROVED & CANVAS DOWNLOAD)
   ========================================= */
function CollageView({ photos }) {
  const allSelected = photos.filter(p => p.isSelected);
  // Pick up to 4 photos for the collage
  const [collagePhotos, setCollagePhotos] = useState([]);
  const [layout, setLayout] = useState('grid2x2'); // 'grid2x2' or 'hero'
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper to load image for canvas
  const loadImageForCanvas = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  // Object-fit: cover equivalent for canvas
  const drawImageCover = (ctx, img, x, y, w, h) => {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > targetRatio) {
      sHeight = img.height;
      sWidth = sHeight * targetRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = sWidth / targetRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  };

  const handleDownload = async () => {
    if (collagePhotos.length === 0) return;
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 1080; // 1080x1080 Square output
      canvas.width = size;
      canvas.height = size;

      // Draw aesthetic white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Load all selected images
      const images = await Promise.all(collagePhotos.map(p => loadImageForCanvas(p.url)));

      const padding = 40;
      const gap = 20;

      if (layout === 'grid2x2') {
        const itemSize = (size - (padding * 2) - gap) / 2;
        const positions = [
          { x: padding, y: padding },
          { x: padding + itemSize + gap, y: padding },
          { x: padding, y: padding + itemSize + gap },
          { x: padding + itemSize + gap, y: padding + itemSize + gap }
        ];

        images.slice(0, 4).forEach((img, i) => {
          if (positions[i]) {
            drawImageCover(ctx, img, positions[i].x, positions[i].y, itemSize, itemSize);
          }
        });
      } else if (layout === 'hero') {
        // 1 large top, 2 small bottom
        const topHeight = (size - (padding * 2) - gap) * 0.6; // 60% height
        const bottomHeight = (size - (padding * 2) - gap) * 0.4;
        const bottomWidth = (size - (padding * 2) - gap) / 2;

        if (images[0]) {
          drawImageCover(ctx, images[0], padding, padding, size - (padding * 2), topHeight);
        }
        if (images[1]) {
          drawImageCover(ctx, images[1], padding, padding + topHeight + gap, bottomWidth, bottomHeight);
        }
        if (images[2]) {
          drawImageCover(ctx, images[2], padding + bottomWidth + gap, padding + topHeight + gap, bottomWidth, bottomHeight);
        }
      }

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Eternite-Collage-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
    }
    setIsDownloading(false);
  };

  const toggleCollagePhoto = (photo) => {
    const isSelected = collagePhotos.some(p => p.id === photo.id);
    if (isSelected) {
      setCollagePhotos(collagePhotos.filter(p => p.id !== photo.id));
    } else {
      if (layout === 'grid2x2' && collagePhotos.length >= 4) return;
      if (layout === 'hero' && collagePhotos.length >= 3) return;
      setCollagePhotos([...collagePhotos, photo]);
    }
  };

  if (allSelected.length === 0) return <EmptyState message="Pilih minimal 1 foto di tab Klien untuk membuat kolase." icon={LayoutTemplate} />;

  const maxPhotos = layout === 'grid2x2' ? 4 : 3;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-gray-900">Kolase Estetik (Sosmed)</h2>
          <p className="text-gray-500 mt-1">Pilih {maxPhotos} foto dari daftar foto terpilih untuk merangkai kolase.</p>
        </div>
        
        <div className="flex bg-white shadow-sm border border-gray-200 p-1 rounded-full">
          <button onClick={() => { setLayout('grid2x2'); setCollagePhotos([]); }} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium ${layout === 'grid2x2' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
            <Grid2X2 className="w-4 h-4" /> Grid 2x2
          </button>
          <button onClick={() => { setLayout('hero'); setCollagePhotos([]); }} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium ${layout === 'hero' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
            <LayoutGrid className="w-4 h-4" /> Hero Layout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Photo Picker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Pilih Foto ({collagePhotos.length}/{maxPhotos})</span>
            <button onClick={() => setCollagePhotos([])} className="text-xs text-red-500 hover:text-red-700">Reset</button>
          </div>
          <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">
            {allSelected.map((photo) => {
              const isSelected = collagePhotos.some(p => p.id === photo.id);
              const isDisabled = !isSelected && collagePhotos.length >= maxPhotos;
              return (
                <div 
                  key={photo.id} 
                  onClick={() => !isDisabled && toggleCollagePhoto(photo)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer relative transition-all ${
                    isSelected ? 'ring-2 ring-gray-900 ring-offset-2' : isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'
                  }`}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1"><Check className="w-4 h-4 text-gray-900" /></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Canvas / Preview Workspace */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-gray-100 w-full p-6 sm:p-12 rounded-3xl flex justify-center items-center">
            {/* The visual preview simulating the actual canvas output */}
            <div className="w-full max-w-[400px] aspect-square bg-white p-4 shadow-xl flex flex-col gap-2 relative">
               {layout === 'grid2x2' ? (
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="bg-gray-50 h-full w-full overflow-hidden flex items-center justify-center text-gray-300">
                         {collagePhotos[i] ? <img src={collagePhotos[i].url} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-6 h-6 opacity-50" />}
                      </div>
                    ))}
                  </div>
               ) : (
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex-grow-[6] bg-gray-50 w-full overflow-hidden flex items-center justify-center text-gray-300">
                      {collagePhotos[0] ? <img src={collagePhotos[0].url} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-8 h-8 opacity-50" />}
                    </div>
                    <div className="flex-grow-[4] grid grid-cols-2 gap-2 w-full">
                      {[1, 2].map(i => (
                        <div key={i} className="bg-gray-50 h-full w-full overflow-hidden flex items-center justify-center text-gray-300">
                          {collagePhotos[i] ? <img src={collagePhotos[i].url} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-6 h-6 opacity-50" />}
                        </div>
                      ))}
                    </div>
                  </div>
               )}
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={collagePhotos.length === 0 || isDownloading}
            className="mt-8 flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Memproses...' : 'Download HD Image (1080x1080)'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   UTILITIES
   ========================================= */
function EmptyState({ message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-[60vh] animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-serif text-gray-900 mb-2">Belum ada data</h3>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );
}