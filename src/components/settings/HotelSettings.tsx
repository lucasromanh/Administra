import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Hotel, User, Building2, Save } from 'lucide-react';
import { 
  getHotelConfig, 
  setHotelLogo, 
  convertImageToBase64,
  updateHotelConfig
} from '@/lib/hotelConfig';

export function HotelSettings() {
  const [config, setConfig] = useState(getHotelConfig());
  const [formData, setFormData] = useState({
    hotelName: config.name,
    adminName: config.adminName || '',
    email: config.email || '',
    phone: config.phone || '',
    address: config.address || '',
    rut: config.rut || '',
  });
  const [previewLogo, setPreviewLogo] = useState(config.logo);
  const [hasChanges, setHasChanges] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png')) {
      alert('Por favor selecciona un archivo PNG');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 2MB');
      return;
    }

    try {
      const base64 = await convertImageToBase64(file);
      setPreviewLogo(base64);
      setHotelLogo(base64);
      setConfig({ ...config, logo: base64 });
      window.location.reload();
    } catch (error) {
      console.error('Error al cargar el logo:', error);
      alert('Error al cargar el logo');
    }
  };

  const handleRemoveLogo = () => {
    setPreviewLogo(undefined);
    setHotelLogo('');
    setConfig({ ...config, logo: undefined });
    window.location.reload();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    updateHotelConfig({
      name: formData.hotelName,
      adminName: formData.adminName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      rut: formData.rut,
      logo: config.logo
    });
    setHasChanges(false);
    alert('Configuración guardada exitosamente');
    window.location.reload();
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general" className="text-xs">
            <Hotel className="h-3 w-3 mr-2" />
            Información General
          </TabsTrigger>
          <TabsTrigger value="admin" className="text-xs">
            <User className="h-3 w-3 mr-2" />
            Administrador
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs">
            <Building2 className="h-3 w-3 mr-2" />
            Logo y Marca
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos del Hotel</CardTitle>
              <CardDescription className="text-xs">
                Información básica de tu establecimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName" className="text-xs">Nombre del Hotel *</Label>
                  <Input
                    id="hotelName"
                    value={formData.hotelName}
                    onChange={(e) => handleInputChange('hotelName', e.target.value)}
                    placeholder="Ej: Hotel Plaza Santiago"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rut" className="text-xs">RUT del Hotel</Label>
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                    placeholder="Ej: 76.123.456-7"
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Ej: Av. Libertador Bernardo O'Higgins 123, Santiago"
                  className="h-9"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Administrador */}
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos del Administrador</CardTitle>
              <CardDescription className="text-xs">
                Información de contacto del administrador del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-xs">Nombre Completo</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => handleInputChange('adminName', e.target.value)}
                  placeholder="Ej: Carlos Administrador"
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="admin@hotel.com"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logo y Marca */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logo del Hotel</CardTitle>
              <CardDescription className="text-xs">
                Personaliza la imagen de tu hotel en el sistema y reportes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewLogo ? (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <img
                    src={previewLogo}
                    alt="Logo del hotel"
                    className="w-20 h-20 object-contain bg-white rounded p-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo actual</p>
                    <p className="text-xs text-muted-foreground">
                      Se muestra en el menú lateral y en los informes PDF
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3 mr-2" />
                    Eliminar
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Hotel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No hay logo configurado
                  </p>
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <span>
                      <Upload className="h-3 w-3 mr-2" />
                      {previewLogo ? 'Cambiar Logo' : 'Subir Logo (PNG)'}
                    </span>
                  </Button>
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-2">
                  Requisitos del logo:
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
                  <li>Formato: PNG (con fondo transparente recomendado)</li>
                  <li>Tamaño máximo: 2MB</li>
                  <li>Dimensiones recomendadas: 300x300 píxeles</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vista Previa</CardTitle>
              <CardDescription className="text-xs">
                Así se verá en el menú lateral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 dark:bg-slate-950 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="Logo"
                      className="w-8 h-8 object-contain bg-white rounded p-0.5"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                      <Hotel className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{formData.hotelName}</h3>
                    <p className="text-[10px] text-slate-400">Administración</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botón de guardar global */}
      {hasChanges && (
        <div className="mt-6 p-4 bg-muted border rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Tienes cambios sin guardar</p>
            <p className="text-xs text-muted-foreground">
              Guarda los cambios para que se reflejen en el sistema
            </p>
          </div>
          <Button onClick={handleSaveAll} size="sm">
            <Save className="h-3 w-3 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  );
}
