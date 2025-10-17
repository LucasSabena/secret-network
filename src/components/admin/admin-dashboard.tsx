'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FileText, FolderTree, Link2, Monitor, DollarSign, Users } from 'lucide-react';
import ProgramasManager from './programas-manager';
import BlogManager from './blog-manager';
import CategoriasManager from './categorias-manager';
import AlternativasManagerNew from './alternativas-manager-new';
import PlataformasManager from './plataformas-manager';
import ModelosDePrecioManager from './modelos-de-precio-manager';
import AutoresManager from './autores-manager';
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
          {/* Tabs responsive: grid en desktop, scroll horizontal en mobile */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <TabsList className="inline-flex lg:grid w-full lg:grid-cols-7 lg:w-[1100px] min-w-max">
              <TabsTrigger value="programas" className="flex items-center gap-2 whitespace-nowrap">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Programas</span>
                <span className="sm:hidden">Prog.</span>
              </TabsTrigger>
              <TabsTrigger value="blogs" className="flex items-center gap-2 whitespace-nowrap">
                <FileText className="h-4 w-4" />
                <span>Blogs</span>
              </TabsTrigger>
              <TabsTrigger value="autores" className="flex items-center gap-2 whitespace-nowrap">
                <Users className="h-4 w-4" />
                <span>Autores</span>
              </TabsTrigger>
              <TabsTrigger value="categorias" className="flex items-center gap-2 whitespace-nowrap">
                <FolderTree className="h-4 w-4" />
                <span className="hidden sm:inline">Categorías</span>
                <span className="sm:hidden">Cat.</span>
              </TabsTrigger>
              <TabsTrigger value="alternativas" className="flex items-center gap-2 whitespace-nowrap">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Alternativas</span>
                <span className="sm:hidden">Alt.</span>
              </TabsTrigger>
              <TabsTrigger value="plataformas" className="flex items-center gap-2 whitespace-nowrap">
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Plataformas</span>
                <span className="sm:hidden">Plat.</span>
              </TabsTrigger>
              <TabsTrigger value="modelos" className="flex items-center gap-2 whitespace-nowrap">
                <DollarSign className="h-4 w-4" />
                <span>Precios</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="programas" className="mt-6">
            <ProgramasManager />
          </TabsContent>

          <TabsContent value="blogs" className="mt-6">
            <BlogManager />
          </TabsContent>

          <TabsContent value="autores" className="mt-6">
            <AutoresManager />
          </TabsContent>

          <TabsContent value="categorias" className="mt-6">
            <CategoriasManager />
          </TabsContent>

          <TabsContent value="alternativas" className="mt-6">
            <AlternativasManagerNew />
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
