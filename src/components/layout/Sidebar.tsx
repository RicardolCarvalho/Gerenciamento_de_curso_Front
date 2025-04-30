import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  LayoutDashboard,
  Star,
  ListPlus,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    {
      title: "Painel",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
      admin: false,
    },
    {
      title: "Cursos",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/courses",
      admin: false,
    },
    {
      title: "Minhas Avaliações",
      icon: <Star className="h-5 w-5" />,
      path: "/my-evaluations",
      admin: false,
    },
    {
      title: "Criar Curso",
      icon: <ListPlus className="h-5 w-5" />,
      path: "/courses/new",
      admin: true,
    },
  ];

  const filteredItems = navItems.filter(
    (item) => !item.admin || (item.admin && isAdmin)
  );

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/40">
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-2 p-4">
        <nav className="grid gap-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  "hover:bg-muted hover:text-primary",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground"
                )
              }
            >
              {item.icon}
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;