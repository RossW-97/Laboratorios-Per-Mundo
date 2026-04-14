import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sprout, 
  Search, 
  ShoppingCart, 
  History, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Leaf, 
  TreeDeciduous,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
  X
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Product, TraceabilityLog, OrderResponse } from "./types";

export default function App() {
  const [showCover, setShowCover] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState("");
  const [growthFilter, setGrowthFilter] = useState("");
  const [loteSearch, setLoteSearch] = useState("");
  const [traceabilityData, setTraceabilityData] = useState<TraceabilityLog[] | null>(null);
  const [traceLoading, setTraceLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(100);
  const [userRole, setUserRole] = useState<"agricultor" | "cooperativa">("agricultor");
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!showCover) {
      fetchProducts();
    }
  }, [showCover, regionFilter, growthFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (regionFilter) params.append("region", regionFilter);
      if (growthFilter) params.append("growth_speed", growthFilter);
      const res = await fetch(`/api/catalogo?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showCover) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-stone-900 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/amazon-biotech/1920/1080?blur=2" 
            alt="Amazon Biotech Cover" 
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/40 to-stone-900"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center text-primary shadow-2xl">
                <Sprout size={48} />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-white mb-6 leading-tight tracking-tighter">
              Laboratorios <br />
              <span className="text-primary italic">Perú Mundo</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Liderando la revolución Agrotech en la Amazonía mediante micropropagación y biotización de élite.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_40px_rgba(230,126,34,0.3)] group"
                onClick={() => setShowCover(false)}
              >
                Explorar Ecosistema 
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>

            <div className="mt-16 flex items-center justify-center gap-8 text-stone-400 text-sm uppercase tracking-widest font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Certificación SENASA
              </div>
              <div className="w-1 h-1 rounded-full bg-stone-600"></div>
              <div className="flex items-center gap-2">
                <Leaf size={18} className="text-primary" />
                Tecnología In Vitro
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-900 to-transparent"></div>
      </motion.div>
    );
  }

  const checkTraceability = async () => {
    if (!loteSearch) return;
    setTraceLoading(true);
    try {
      const res = await fetch(`/api/trazabilidad/${loteSearch}`);
      if (res.ok) {
        const data = await res.json();
        setTraceabilityData(data);
      } else {
        setTraceabilityData(null);
        alert("Lote no encontrado");
      }
    } catch (error) {
      console.error("Error checking traceability:", error);
    } finally {
      setTraceLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          quantity: orderQuantity,
          user_role: userRole,
          user_id: 1 // Mock user
        })
      });
      const data = await res.json();
      setOrderResult(data);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const calculatePreviewPrice = () => {
    if (!selectedProduct) return 0;
    let price = selectedProduct.base_price * orderQuantity;
    if (userRole === "cooperativa" && orderQuantity >= 1000) price *= 0.85;
    else if (orderQuantity >= 5000) price *= 0.90;
    return price;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <Sprout size={24} />
          </div>
          <h1 className="text-xl font-bold text-primary font-headline tracking-tight">Laboratorios Perú Mundo</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#catalogo" className="text-sm font-semibold hover:text-primary transition-colors">Catálogo</a>
          <a href="#trazabilidad" className="text-sm font-semibold hover:text-primary transition-colors">Trazabilidad</a>
          <a href="#nosotros" className="text-sm font-semibold hover:text-primary transition-colors">Nosotros</a>
          <Button variant="default" className="rounded-full px-6">Acceso Cliente</Button>
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-semibold">
              <a href="#catalogo" onClick={() => setIsMenuOpen(false)}>Catálogo</a>
              <a href="#trazabilidad" onClick={() => setIsMenuOpen(false)}>Trazabilidad</a>
              <a href="#nosotros" onClick={() => setIsMenuOpen(false)}>Nosotros</a>
              <Button className="w-full rounded-xl py-6">Acceso Cliente</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/amazon-rainforest/1920/1080" 
              alt="Amazon Rainforest" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1 uppercase tracking-widest">
                Tecnología In Vitro
              </Badge>
              <h2 className="text-5xl md:text-7xl font-headline font-extrabold text-stone-900 leading-[1.1] mb-6">
                Ciencia Élite para la <span className="text-primary italic">Amazonía</span>
              </h2>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-10 max-w-lg">
                Plantas certificadas de plátano y especies forestales con biotecnología avanzada. 
                Mayor rendimiento, cero enfermedades, trazabilidad total.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#catalogo" 
                  className={cn(
                    buttonVariants({ size: "lg" }), 
                    "bg-accent hover:bg-accent/90 text-white rounded-xl px-8 py-7 text-lg shadow-lg"
                  )}
                >
                  Comprar plantas certificadas
                </a>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 rounded-xl px-8 py-7 text-lg">
                  Solicitar Asesoría
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary text-white">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-headline font-bold mb-1">1M+</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Plantas Anuales</div>
            </div>
            <div>
              <div className="text-4xl font-headline font-bold mb-1">30%</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Crecimiento más rápido</div>
            </div>
            <div>
              <div className="text-4xl font-headline font-bold mb-1">99%</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Sanidad Garantizada</div>
            </div>
            <div>
              <div className="text-4xl font-headline font-bold mb-1">24/7</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Asesoría Técnica</div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalogo" className="py-24 container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Líneas de Producción</h3>
              <p className="text-stone-500">Material genético de alta pureza con certificación SENASA.</p>
            </div>
            <div className="flex gap-4">
              <select 
                className="bg-white border border-border rounded-lg px-4 py-2 text-sm"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="">Todas las regiones</option>
                <option value="Loreto">Loreto</option>
                <option value="San Martín">San Martín</option>
              </select>
              <select 
                className="bg-white border border-border rounded-lg px-4 py-2 text-sm"
                value={growthFilter}
                onChange={(e) => setGrowthFilter(e.target.value)}
              >
                <option value="">Velocidad de crecimiento</option>
                <option value="Rápido">Rápido</option>
                <option value="Moderado">Moderado</option>
                <option value="Lento">Lento</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:shadow-xl transition-all">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/${product.variety}/600/400`} 
                        alt={product.variety}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-white">
                        {product.biotization_type}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{product.variety}</CardTitle>
                        <span className="text-primary font-bold">S/ {product.base_price.toFixed(2)}</span>
                      </div>
                      <CardDescription>{product.species}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-stone-600">
                          <MapPin size={14} /> {product.region}
                        </div>
                        <div className="flex items-center gap-2 text-stone-600">
                          <ShieldCheck size={14} className="text-green-600" /> {product.senasa_cert}
                        </div>
                        <div className="flex items-center gap-2 text-stone-600">
                          <Leaf size={14} className="text-primary" /> Stock: {product.stock_in_vitro} plántulas
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full rounded-xl" 
                        onClick={() => setSelectedProduct(product)}
                      >
                        Reservar Lote
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Traceability Section */}
        <section id="trazabilidad" className="py-24 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-headline font-bold mb-4">Trazabilidad en <span className="text-primary">Tiempo Real</span></h3>
                <p className="text-stone-600">Ingresa tu ID de Lote para ver el estado de tus plantas en nuestro laboratorio.</p>
              </div>

              <div className="flex gap-4 mb-12">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <Input 
                    placeholder="Ej: LPM-1-202404" 
                    className="pl-12 h-14 rounded-xl text-lg"
                    value={loteSearch}
                    onChange={(e) => setLoteSearch(e.target.value)}
                  />
                </div>
                <Button 
                  size="lg" 
                  className="h-14 px-8 rounded-xl"
                  onClick={checkTraceability}
                  disabled={traceLoading}
                >
                  {traceLoading ? <Loader2 className="animate-spin" /> : "Consultar"}
                </Button>
              </div>

              {traceabilityData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-border"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-1">Lote</h4>
                      <p className="text-2xl font-bold">{traceabilityData[0].lote_id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-1">Especie</h4>
                      <p className="text-lg font-semibold">{traceabilityData[0].variety} ({traceabilityData[0].species})</p>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-1">Estado</h4>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{traceabilityData[0].status}</Badge>
                    </div>
                  </div>

                  <Separator className="mb-8" />

                  <div className="space-y-8">
                    {traceabilityData.map((log, idx) => (
                      <div key={log.id} className="flex gap-6 relative">
                        {idx !== traceabilityData.length - 1 && (
                          <div className="absolute left-[11px] top-8 bottom-[-32px] w-[2px] bg-border"></div>
                        )}
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 z-10 ${idx === 0 ? 'bg-primary' : 'bg-stone-200'}`}>
                          {idx === 0 && <div className="w-full h-full rounded-full animate-ping bg-primary opacity-50"></div>}
                        </div>
                        <div>
                          <p className="text-sm text-stone-400 mb-1">{new Date(log.timestamp).toLocaleDateString()} - {new Date(log.timestamp).toLocaleTimeString()}</p>
                          <h5 className="font-bold text-lg mb-1">{log.stage}</h5>
                          <p className="text-stone-600">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Order Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reserva de Plantas Certificadas</DialogTitle>
            <DialogDescription>
              Estás reservando un lote de <span className="font-bold text-stone-900">{selectedProduct?.variety}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Tipo de Cliente</label>
              <Tabs value={userRole} onValueChange={(v: any) => setUserRole(v)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="agricultor">Agricultor</TabsTrigger>
                  <TabsTrigger value="cooperativa">Cooperativa</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Cantidad de Plántulas</label>
              <Input 
                type="number" 
                value={orderQuantity} 
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                min={100}
              />
              <p className="text-[10px] text-stone-400 italic">
                * Cooperativas: 15% de descuento por volumen (+1,000 unidades).
              </p>
            </div>

            <div className="bg-muted p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span>Precio Unitario</span>
                <span>S/ {selectedProduct?.base_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>Total Estimado</span>
                <span className="text-primary">S/ {calculatePreviewPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-stone-500 bg-blue-50 p-3 rounded-lg">
              <AlertCircle size={16} className="text-blue-600 flex-shrink-0" />
              <p>El ciclo de producción biotecnológica es de 12-16 meses. Recibirás un cronograma detallado tras confirmar.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancelar</Button>
            <Button className="bg-accent hover:bg-accent/90 text-white" onClick={handleOrder}>Confirmar Reserva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!orderResult} onOpenChange={() => setOrderResult(null)}>
        <DialogContent className="max-w-md rounded-2xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl">¡Pedido Confirmado!</DialogTitle>
            <DialogDescription className="text-lg">
              Tu lote ha sido registrado con éxito.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-6 rounded-2xl space-y-4 my-4 text-left">
            <div>
              <h5 className="text-xs uppercase tracking-widest text-stone-400">ID de Lote (Trazabilidad)</h5>
              <p className="text-xl font-mono font-bold text-primary">{orderResult?.loteId}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs uppercase tracking-widest text-stone-400">Entrega Estimada</h5>
                <p className="font-semibold">{orderResult ? new Date(orderResult.estimatedDelivery).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }) : ''}</p>
              </div>
              <div>
                <h5 className="text-xs uppercase tracking-widest text-stone-400">Total</h5>
                <p className="font-semibold">S/ {orderResult?.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-stone-500 mb-6">
            {orderResult?.message}
          </p>

          <Button className="w-full h-12 rounded-xl" onClick={() => setOrderResult(null)}>
            Entendido
          </Button>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Sprout size={32} className="text-primary" />
              <h4 className="text-2xl font-headline font-bold">Laboratorios Perú Mundo</h4>
            </div>
            <p className="text-stone-400 max-w-md leading-relaxed">
              Líderes en biotecnología vegetal para la Amazonía. 
              Transformando la agricultura mediante ciencia élite y compromiso ambiental.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6">Enlaces</h5>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Catálogo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trazabilidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certificaciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Ubicación</h5>
            <p className="text-stone-400 mb-4">Iquitos, Loreto - Perú</p>
            <p className="text-stone-400">Estación Experimental Amazonía</p>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/10 text-center text-stone-500 text-sm">
          © 2026 Laboratorios Perú Mundo. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
