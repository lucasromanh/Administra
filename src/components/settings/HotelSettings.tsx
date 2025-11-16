import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Hotel } from 'lucide-react';
import { getHotelConfig, setHotelLogo, setHotelName, convertImageToBase64 } from '@/lib/hotelConfig';

export function HotelSettings() {
  const [config, setConfig] = useState(getHotelConfig());
  const [hotelName, setHotelNameInput] = useState(config.name);
  const [previewLogo, setPreviewLogo] = useState(config.logo);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea PNG
    if (!file.type.includes('png')) {
      alert('Por favor selecciona un archivo PNG');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 2MB');
      return;
    }

    try {
      const base64 = await convertImageToBase64(file);
      setPreviewLogo(base64);
      setHotelLogo(base64);
      setConfig({ ...config, logo: base64 });
      
      // Recargar página para actualizar sidebar
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

  const handleSaveName = () => {
    setHotelName(hotelName);
    setConfig({ ...config, name: hotelName });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            Configuración del Hotel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nombre del Hotel */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del Hotel</label>
            <div className="flex gap-2">
              <Input
                value={hotelName}
                onChange={(e) => setHotelNameInput(e.target.value)}
                placeholder="Ej: Hotel Plaza Santiago"
              />
              <Button onClick={handleSaveName} disabled={!hotelName.trim()}>
                Guardar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Este nombre aparecerá en el menú lateral y en los informes PDF
            </p>
          </div>

          {/* Logo del Hotel */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo del Hotel</label>
            
            {previewLogo ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <img
                    src={previewLogo}
                    alt="Logo del hotel"
                    className="w-24 h-24 object-contain bg-white rounded p-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo actual</p>
                    <p className="text-xs text-muted-foreground">
                      El logo se mostrará en el menú lateral y en los informes
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
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
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {previewLogo ? 'Cambiar Logo' : 'Subir Logo (PNG)'}
                  </span>
                </Button>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Requisitos del logo:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                <li>Formato: PNG (con fondo transparente recomendado)</li>
                <li>Tamaño máximo: 2MB</li>
                <li>Dimensiones recomendadas: 300x300 píxeles</li>
                <li>El logo se redimensionará automáticamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Logo"
                  className="w-12 h-12 object-contain bg-white rounded p-1"
                />
              ) : (
                <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                  <Hotel className="h-6 w-6 text-slate-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{hotelName}</h3>
                <p className="text-xs text-slate-400">Así se verá en el menú</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
