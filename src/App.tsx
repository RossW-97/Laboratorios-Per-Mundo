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
  X,
  ClipboardList,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  FlaskConical,
  Microscope,
  FileText,
  ChevronRight,
  FlaskRound
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
  const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false);
  const [activeLine, setActiveLine] = useState<"Musáceas" | "Forestal" | "">("");

  useEffect(() => {
    if (!showCover) {
      fetchProducts();
    }
  }, [showCover, regionFilter, growthFilter, activeLine]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (regionFilter) params.append("region", regionFilter);
      if (growthFilter) params.append("growth_speed", growthFilter);
      if (activeLine) params.append("line", activeLine);
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
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <img 
              src="https://picsum.photos/seed/amazon-biotech-vibe/1920/1080?blur=2" 
              alt="Amazon Biotech Cover" 
              className="w-full h-full object-cover opacity-40 scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-stone-900/60 to-stone-900"></div>
          
          {/* Animated floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-primary/10 blur-[100px]"
              animate={{
                x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
                y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              }}
              transition={{
                duration: 10 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-white backdrop-blur-xl border border-primary/30 flex items-center justify-center shadow-2xl overflow-hidden p-2">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKq1od6ZBRIwZuSMupZloRtyQgO7jrPgFokmtF-9jdSHK5DNep6VAPua2jPOMUn1UbnFHcFiz2Jg94_CC0zWp1GtWC6nF8I7K4rGMNA6J17O8o1WAka2CNr8c1AMF2BXHjzGu6MtxZICY-n2Ji9srsfpYavDHZZUn_EsMRymLk8D4wI_UIP1YUrBjUu8Xsi_LGSlOabrvDdytzHCkHZ7X7T4z_C5DozFO3Biv0AjIPKBJLNb1LBh9D8ElHLClRgmu5-C9ONILlaQ" 
                  alt="Laboratorios Perú Mundo Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
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
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-8 text-xl font-bold shadow-2xl group border-2 border-white/20"
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
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center border border-border">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKq1od6ZBRIwZuSMupZloRtyQgO7jrPgFokmtF-9jdSHK5DNep6VAPua2jPOMUn1UbnFHcFiz2Jg94_CC0zWp1GtWC6nF8I7K4rGMNA6J17O8o1WAka2CNr8c1AMF2BXHjzGu6MtxZICY-n2Ji9srsfpYavDHZZUn_EsMRymLk8D4wI_UIP1YUrBjUu8Xsi_LGSlOabrvDdytzHCkHZ7X7T4z_C5DozFO3Biv0AjIPKBJLNb1LBh9D8ElHLClRgmu5-C9ONILlaQ" 
              alt="Laboratorios Perú Mundo Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-bold text-primary font-headline tracking-tight">Laboratorios Perú Mundo</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => { setActiveLine("Forestal"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}
            className={cn("text-sm font-semibold hover:text-primary transition-colors", activeLine === "Forestal" && "text-primary border-b-2 border-primary")}
          >
            Línea Forestal
          </button>
          <button 
            onClick={() => { setActiveLine("Musáceas"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}
            className={cn("text-sm font-semibold hover:text-primary transition-colors", activeLine === "Musáceas" && "text-primary border-b-2 border-primary")}
          >
            Línea Musáceas
          </button>
          <button 
            onClick={() => setIsServicesDialogOpen(true)}
            className="text-sm font-semibold hover:text-primary transition-colors"
          >
            Servicios
          </button>
          <a href="#trazabilidad" className="text-sm font-semibold hover:text-primary transition-colors">Trazabilidad</a>
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
              <button className="text-left" onClick={() => { setActiveLine("Forestal"); setIsMenuOpen(false); document.getElementById("catalogo")?.scrollIntoView(); }}>Línea Forestal</button>
              <button className="text-left" onClick={() => { setActiveLine("Musáceas"); setIsMenuOpen(false); document.getElementById("catalogo")?.scrollIntoView(); }}>Línea Musáceas</button>
              <button className="text-left" onClick={() => { setIsServicesDialogOpen(true); setIsMenuOpen(false); }}>Servicios</button>
              <a href="#trazabilidad" onClick={() => setIsMenuOpen(false)}>Trazabilidad</a>
              <Button className="w-full rounded-xl py-6">Acceso Cliente</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src="https://picsum.photos/seed/amazon-rainforest-vibrant/1920/1080" 
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
                    "bg-accent hover:bg-accent/90 text-white rounded-2xl px-10 py-8 text-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                  )}
                >
                  Comprar plantas certificadas
                </a>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/5 rounded-xl px-8 py-7 text-lg"
                  onClick={() => setIsServicesDialogOpen(true)}
                >
                  Solicitar Servicios
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
        <section id="catalogo" className="py-24 bg-[#FCFAF5]">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-primary mb-4">
                <span className="text-sm font-bold uppercase tracking-widest">División Biotecnológica</span>
                <ChevronRight size={14} />
                <span className="text-sm font-bold uppercase tracking-widest">{activeLine || "Líneas de Producción"}</span>
              </div>
              
              {!activeLine && (
                <div className="mb-20">
                  <div className="relative rounded-[3rem] overflow-hidden mb-16 h-[400px] flex items-center">
                    <img 
                      src="https://picsum.photos/seed/amazon-lab-greenhouse/1920/1080" 
                      alt="Greenhouse" 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-900/50"></div>
                    <div className="relative z-10 px-12 max-w-2xl">
                      <Badge className="mb-4 bg-primary/20 backdrop-blur-md text-white border-white/20 px-3 py-1">PROPAGACIÓN IN VITRO</Badge>
                      <h3 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6 leading-tight">Nuestras Líneas de <br />Producción</h3>
                      <p className="text-lg text-stone-200 font-light leading-relaxed">
                        Innovación biotecnológica desde el corazón de la Amazonía para una agricultura de alto rendimiento y sostenibilidad ambiental.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Línea Musáceas Entrance Card */}
                    <motion.div 
                      whileHover={{ y: -10 }}
                      onClick={() => setActiveLine("Musáceas")}
                      className="group cursor-pointer rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col"
                    >
                      <div className="h-72 relative overflow-hidden">
                        <img 
                          src="https://picsum.photos/seed/musacea-plant-vibrant/800/600" 
                          alt="Línea Musáceas" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-6 left-6 flex gap-2">
                          <Badge className="bg-[#4a7c59] text-white border-none text-[10px] py-0.5">BIOTIZADO</Badge>
                          <Badge className="bg-[#8b7355] text-white border-none text-[10px] py-0.5">ALTO RENDIMIENTO</Badge>
                        </div>
                      </div>
                      <div className="p-10 flex-1 flex flex-col">
                        <h4 className="text-3xl font-headline font-bold mb-4 text-[#2d4a22]">Línea Musáceas</h4>
                        <p className="text-stone-500 mb-8 font-light leading-relaxed flex-1">
                          Utilizamos técnicas avanzadas de micropropagación para garantizar plantas libres de patógenos, con un desarrollo radicular superior y adaptabilidad inmediata al campo.
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><CheckCircle2 size={12}/> Banano</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><CheckCircle2 size={12}/> Plátano</span>
                          </div>
                          <span className="text-primary font-bold flex items-center gap-2 text-sm group-hover:translate-x-1 transition-transform">
                            Saber más <ChevronRight size={16}/>
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Línea Forestal Entrance Card */}
                    <motion.div 
                      whileHover={{ y: -10 }}
                      onClick={() => setActiveLine("Forestal")}
                      className="group cursor-pointer rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col"
                    >
                      <div className="h-72 relative overflow-hidden bg-[#fafafa] flex items-center justify-center">
                        <img 
                          src="https://picsum.photos/seed/amazon-big-tree/800/800" 
                          alt="Línea Forestal" 
                          className="w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-6 left-6 flex gap-2">
                          <Badge className="bg-[#2e5e4e] text-white border-none text-[10px] py-0.5">99% SANIDAD</Badge>
                          <Badge className="bg-[#6b6358] text-white border-none text-[10px] py-0.5">SOSTENIBILIDAD</Badge>
                        </div>
                      </div>
                      <div className="p-10 flex-1 flex flex-col">
                        <h4 className="text-3xl font-headline font-bold mb-4 text-[#2d4a22]">Línea Forestal</h4>
                        <p className="text-stone-500 mb-8 font-light leading-relaxed flex-1">
                          Especialistas en la recuperación de especies amazónicas de alto valor comercial. Nuestra clonación garantiza la preservación de genéticas superiores para reforestación estratégica.
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><CheckCircle2 size={12}/> Palo de Rosa</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><CheckCircle2 size={12}/> Caoba</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><CheckCircle2 size={12}/> Cedro</span>
                          </div>
                          <span className="text-primary font-bold flex items-center gap-2 text-sm group-hover:translate-x-1 transition-transform">
                            Saber más <ChevronRight size={16}/>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              {activeLine === "Musáceas" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveLine("")}
                    className="mb-8 pl-0 text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16}/> 
                    Volver a Líneas de Producción
                  </Button>
                  
                  <div className="relative rounded-[2.5rem] overflow-hidden bg-[#eef5ed] border border-[#dce9db] shadow-sm flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-10 md:p-14 relative z-10">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                      <Badge className="mb-4 bg-[#4a7c59] text-white border-none py-1">LÍNEA DE ÉLITE</Badge>
                      <h3 className="text-5xl md:text-6xl font-headline font-bold mb-6 text-[#2d4a22]">Línea Musáceas</h3>
                      <p className="text-xl text-stone-600 mb-8 leading-relaxed font-light">
                        Producción masiva de clones de alta calidad mediante <span className="font-semibold text-primary">Micropropagación</span>, libre de patógenos críticos y precocidad productiva garantizada.
                      </p>
                      <div className="inline-flex items-center gap-3 bg-[#4a7c59]/10 text-[#4a7c59] px-6 py-3 rounded-full text-sm font-bold border border-[#4a7c59]/20">
                        <CheckCircle2 size={18} />
                        BIOTIZADA CON MICROORGANISMOS NATIVOS
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 min-h-[300px] relative">
                      <img 
                        src="https://picsum.photos/seed/musacea-overview/800/800" 
                        alt="Musáceas Overview" 
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeLine === "Forestal" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveLine("")}
                    className="mb-8 pl-0 text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16}/> 
                    Volver a Líneas de Producción
                  </Button>

                  <div className="relative rounded-[2.5rem] overflow-hidden bg-[#f0f2f1] border border-[#e2e6e4] shadow-sm flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-10 md:p-14 relative z-10">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-green-900/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                      <Badge className="mb-4 bg-[#1b3022] text-white border-none py-1">REFORESTACIÓN ESTRATÉGICA</Badge>
                      <h3 className="text-5xl md:text-6xl font-headline font-bold mb-6 text-[#1b3022]">Línea Forestal</h3>
                      <p className="text-xl text-stone-600 mb-8 leading-relaxed font-light">
                        Impulsamos la reforestación de alto valor mediante técnicas <span className="font-semibold text-primary">in vitro avanzadas</span>, garantizando vigor genético y adaptabilidad climática superior.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 bg-white border border-stone-200 p-3 rounded-xl shadow-sm">
                          <ShieldCheck size={18} className="text-green-600"/>
                          <span className="text-xs font-bold uppercase tracking-tighter">99% Sanidad</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-stone-200 p-3 rounded-xl shadow-sm">
                          <Leaf size={18} className="text-blue-600"/>
                          <span className="text-xs font-bold uppercase tracking-tighter">Sostenibilidad</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 min-h-[300px] relative">
                      <img 
                        src="https://picsum.photos/seed/forest-overview/800/800" 
                        alt="Forestal Overview" 
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
          </div>

          {(activeLine || regionFilter || growthFilter) && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
            <div className="flex gap-2">
              <Button 
                variant={activeLine === "" ? "default" : "outline"} 
                onClick={() => setActiveLine("")}
                className="rounded-full"
              >
                Todos
              </Button>
              <Button 
                variant={activeLine === "Musáceas" ? "default" : "outline"} 
                onClick={() => setActiveLine("Musáceas")}
                className="rounded-full"
              >
                Musáceas
              </Button>
              <Button 
                variant={activeLine === "Forestal" ? "default" : "outline"} 
                onClick={() => setActiveLine("Forestal")}
                className="rounded-full"
              >
                Forestal
              </Button>
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
                        src={product.variety === "Curaré Enano" 
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuD9_Vn-p9f9-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y" 
                          : product.variety === "Red Banano Enano"
                          ? "https://picsum.photos/seed/redbanana/600/400"
                          : product.variety === "Isla Maleño"
                          ? "https://picsum.photos/seed/islamaleno/600/400"
                          : product.variety === "Palo Rosa"
                          ? "https://picsum.photos/seed/aniba/600/400"
                          : product.variety === "Cedro"
                          ? "https://picsum.photos/seed/cedar-timber/600/400"
                          : product.variety === "Caoba"
                          ? "https://picsum.photos/seed/mahogany-premium/600/400"
                          : `https://picsum.photos/seed/${product.variety}/600/400`} 
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
                        <div>
                          <CardTitle className="text-xl">{product.variety}</CardTitle>
                          <p className="text-xs text-stone-400 font-mono mt-1">ID: {product.code}</p>
                        </div>
                        <span className="text-primary font-bold">S/ {product.base_price.toFixed(2)}</span>
                      </div>
                      <CardDescription>{product.species}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Cosecha / Ciclo</p>
                            <p className="text-sm font-bold">{product.height}</p>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Estado / Fusarium</p>
                            <p className="text-sm font-bold">{product.tolerance}</p>
                          </div>
                        </div>
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
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white border-none shadow-none" 
                        onClick={() => setSelectedProduct(product)}
                      >
                        Ver Ficha Técnica <FileText className="ml-2" size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
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

      {/* Order / Technical Sheet Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => { setSelectedProduct(null); setOrderResult(null); }}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col md:flex-row h-full lg:max-h-[90vh]">
            {/* Image Column (Reposicionada) */}
            <div className="w-full md:w-1/2 relative bg-stone-100 min-h-[300px] md:min-h-full">
              <img 
                src={selectedProduct?.variety === "Curaré Enano" 
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuD9_Vn-p9f9-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y-f-Y" 
                  : selectedProduct?.variety === "Red Banano Enano"
                  ? "https://picsum.photos/seed/redbanana/1000/1000"
                  : selectedProduct?.variety === "Isla Maleño"
                  ? "https://picsum.photos/seed/islamaleno/1000/1000"
                  : `https://picsum.photos/seed/${selectedProduct?.variety}/1000/1000`} 
                alt={selectedProduct?.variety}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-stone-900/10"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <Badge className="mb-2 bg-primary/20 backdrop-blur-md border-white/20 text-white px-3 py-1 uppercase tracking-widest text-[10px]">
                  Ficha Técnica Certificada
                </Badge>
                <h3 className="text-4xl font-headline font-bold">{selectedProduct?.variety}</h3>
                <p className="text-white/80 font-light italic">{selectedProduct?.species}</p>
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Código de Registro</h4>
                  <p className="font-mono text-primary font-bold">{selectedProduct?.code}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Precio Base</h4>
                  <p className="text-3xl font-headline font-bold text-stone-900">S/ {selectedProduct?.base_price.toFixed(2)}</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">I.G.V. Incluido</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                       <ShieldCheck size={14}/> Certificación
                    </h5>
                    <p className="text-sm text-stone-700 font-semibold">{selectedProduct?.senasa_cert}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                       <MapPin size={14}/> Región
                    </h5>
                    <p className="text-sm text-stone-700 font-semibold">{selectedProduct?.region}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                       <Clock size={14}/> Ciclo
                    </h5>
                    <p className="text-sm text-stone-700 font-semibold">{selectedProduct?.height}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                       <Leaf size={14}/> Estado
                    </h5>
                    <p className="text-sm text-stone-700 font-semibold">{selectedProduct?.tolerance}</p>
                  </div>
                </div>
              </div>

              <Separator className="mb-10" />

              <div className="flex-1 space-y-8">
                {selectedProduct?.technical_details && (
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-[#2d4a22] mb-3 flex items-center gap-2">
                       <Microscope size={14}/> Características del Cultivar
                    </h5>
                    <p className="text-sm text-stone-600 leading-relaxed font-light italic">
                      {selectedProduct.technical_details}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-lg font-bold flex items-center gap-2">Reserva de Lote <Badge variant="outline" className="text-[10px]">PRE-ORDEN</Badge></h4>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-400">Tipo de Cliente</label>
                    <Tabs value={userRole} onValueChange={(v: any) => setUserRole(v)}>
                      <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-stone-50 border border-stone-100 p-1">
                        <TabsTrigger value="agricultor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Agricultor</TabsTrigger>
                        <TabsTrigger value="cooperativa" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Cooperativa</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-stone-400">Cantidad (Plantas)</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={orderQuantity} 
                        onChange={(e) => setOrderQuantity(Number(e.target.value))}
                        min={100}
                        className="h-14 rounded-xl pl-12 text-lg font-bold"
                      />
                      <Sprout size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    </div>
                    {userRole === "cooperativa" && (
                      <p className="text-[10px] text-primary italic font-medium">
                        * Aplicando beneficio Cooperativo: 15% de descuento por volumen.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-[#FCFAF5] p-6 rounded-2xl border border-primary/10 flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Total Estimado</p>
                    <p className="text-3xl font-headline font-bold text-primary">S/ {calculatePreviewPrice().toFixed(2)}</p>
                  </div>
                  <Button 
                    className="h-14 px-8 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-lg flex gap-3 shadow-lg"
                    onClick={handleOrder}
                  >
                    Confirmar Reserva <ArrowRight size={20}/>
                  </Button>
                </div>
              </div>
            </div>
          </div>
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

      {/* Services Dialog */}
      <Dialog open={isServicesDialogOpen} onOpenChange={setIsServicesDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none">
          <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
            {/* Sidebar Info */}
            <div className="w-full md:w-1/3 bg-stone-50 p-8 border-r border-border">
              <h3 className="text-3xl font-headline font-bold mb-6 leading-tight">Impulsando el futuro <span className="text-primary">agrícola de Perú</span></h3>
              <p className="text-stone-600 mb-8 text-sm leading-relaxed">
                Complete este formulario para iniciar su proceso de análisis o consultoría técnica. Nuestro equipo de especialistas revisará su solicitud en un plazo de 24 horas.
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Certificación ISO</p>
                  <p className="text-[10px] text-stone-500">Estándares internacionales en cada proceso.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <FlaskRound size={14} /> Nuestros Servicios
                </h4>
                <div className="space-y-2">
                  {[
                    { title: "MICROPROPAGACIÓN", desc: "Propagación clonal y masiva de especies frutales o forestales." },
                    { title: "DESARROLLO DE TÉCNICAS", desc: "Desarrollo de protocolos de Micropropagación, Embriogénesis, Organogénesis." },
                    { title: "ASESORÍA TÉCNICA", desc: "Acompañamiento especializado para el establecimiento de cultivos in vitro." }
                  ].map((s, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-border hover:border-primary/30 transition-colors">
                      <p className="text-[10px] font-bold text-primary mb-1">{s.title}</p>
                      <p className="text-[10px] text-stone-500 leading-tight">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 bg-white p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardList className="text-primary" /> Solicitar Servicios
                </h4>
                <Button variant="ghost" size="sm" onClick={() => setIsServicesDialogOpen(false)} className="text-stone-400">
                  Cancel
                </Button>
              </div>

              <div className="space-y-8">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <User size={14} /> Información de Contacto
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Nombre Completo</label>
                      <Input placeholder="Ej. Ricardo Palma" className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Correo Electrónico</label>
                      <Input placeholder="ricardo@empresa.pe" className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Número de Teléfono</label>
                      <Input placeholder="+51 900 000 000" className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Organización / Empresa</label>
                      <Input placeholder="Nombre de su organización" className="rounded-xl h-12" />
                    </div>
                  </div>
                </div>

                {/* Service Type & Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                      <Microscope size={14} /> Tipo de Servicio
                    </h5>
                    <select className="w-full h-12 rounded-xl border border-border px-4 bg-stone-50 text-sm">
                      <option>Seleccione un servicio</option>
                      <option>Micropropagación</option>
                      <option>Desarrollo de Técnicas</option>
                      <option>Asesoría Técnica</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                      <Clock size={14} /> Urgencia del Proyecto
                    </h5>
                    <select className="w-full h-12 rounded-xl border border-border px-4 bg-stone-50 text-sm">
                      <option>Nivel de prioridad</option>
                      <option>Baja</option>
                      <option>Media</option>
                      <option>Alta / Inmediata</option>
                    </select>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <FileText size={14} /> Detalles del Proyecto
                  </h5>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Describa sus necesidades específicas</label>
                    <textarea 
                      className="w-full min-h-[120px] rounded-2xl border border-border p-4 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Por favor, incluya detalles sobre los cultivos, el área de estudio o los objetivos específicos de su solicitud..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" className="rounded-xl h-12 px-8">Guardar Borrador</Button>
                  <Button className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90" onClick={() => setIsServicesDialogOpen(false)}>Enviar Solicitud</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <footer className="bg-stone-900 text-white py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-white p-1 overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKq1od6ZBRIwZuSMupZloRtyQgO7jrPgFokmtF-9jdSHK5DNep6VAPua2jPOMUn1UbnFHcFiz2Jg94_CC0zWp1GtWC6nF8I7K4rGMNA6J17O8o1WAka2CNr8c1AMF2BXHjzGu6MtxZICY-n2Ji9srsfpYavDHZZUn_EsMRymLk8D4wI_UIP1YUrBjUu8Xsi_LGSlOabrvDdytzHCkHZ7X7T4z_C5DozFO3Biv0AjIPKBJLNb1LBh9D8ElHLClRgmu5-C9ONILlaQ" 
                  alt="Laboratorios Perú Mundo Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
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
