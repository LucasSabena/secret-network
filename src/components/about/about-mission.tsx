// FILE: src/components/about/about-mission.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Gem, Code } from "lucide-react";

const missions = [
  {
    icon: Target,
    title: "Curación Inteligente",
    description: "Seleccionamos cuidadosamente cada herramienta basándonos en su calidad, utilidad y relevancia para la comunidad creativa."
  },
  {
    icon: Users,
    title: "Comunidad Primero",
    description: "Construimos este directorio pensando en diseñadores, por diseñadores. Cada decisión se toma con la comunidad en mente."
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Creemos firmemente en el poder del código abierto. Promovemos y destacamos herramientas open-source siempre que sea posible."
  },
  {
    icon: Gem,
    title: "Acceso para Todos",
    description: "Las mejores herramientas no deberían estar limitadas por el precio. Priorizamos alternativas accesibles sin comprometer la calidad."
  }
];

export function AboutMission() {
  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestra Misión</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Democratizar el acceso a herramientas de diseño de calidad profesional
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {missions.map((mission, index) => (
          <Card key={index} className="group hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <mission.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
