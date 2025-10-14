'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FileText, FolderTree, Link2, Monitor, DollarSign } from 'lucide-react';
import ProgramasManager from './programas-manager';
import BlogManager from './blog-manager';
import CategoriasManager from './categorias-manager';
import AlternativasManager from './alternativas-manager';
import PlataformasManager from './plataformas-manager';
import ModelosDePrecioManager from './modelos-de-precio-manager';
import AdminHeader from './admin-header';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('programas');

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona todos los programas, blogs y categorías de tu sitio
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-[1000px]">
            <TabsTrigger value="programas" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Programas
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="alternativas" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Alternativas
            </TabsTrigger>
            <TabsTrigger value="plataformas" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Plataformas
            </TabsTrigger>
            <TabsTrigger value="modelos" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Precios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programas" className="mt-6">
            <ProgramasManager />
          </TabsContent>

          <TabsContent value="blogs" className="mt-6">
            <BlogManager />
          </TabsContent>

          <TabsContent value="categorias" className="mt-6">
            <CategoriasManager />
          </TabsContent>

          <TabsContent value="alternativas" className="mt-6">
            <AlternativasManager />
          </TabsContent>

          <TabsContent value="plataformas" className="mt-6">
            <PlataformasManager />
          </TabsContent>

          <TabsContent value="modelos" className="mt-6">
            <ModelosDePrecioManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
