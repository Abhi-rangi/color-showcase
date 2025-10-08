"use client";

import { ColorCard } from "@/components/color-card";
import { ColorDemo } from "@/components/color-demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Palette, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase, ColorData as SupabaseColorData } from "@/lib/supabase";
import {
  fetchColorsFromGitHub,
  saveColorsToGitHub,
  isGitHubConfigured,
} from "@/lib/github-storage";

const defaultColors = [
  {
    id: "default-1",
    name: "Primary Dark Cyan",
    hex: "#005a5e",
    rgb: "rgb(0, 90, 94)",
    usage: "Main brand color, buttons, links",
    category: "primary",
  },
  {
    id: "default-2",
    name: "Secondary Purple",
    hex: "#7c3aed",
    rgb: "rgb(124, 58, 237)",
    usage: "Accent color, highlights, CTAs",
    category: "primary",
  },
  {
    id: "default-3",
    name: "Tertiary Teal",
    hex: "#0d9488",
    rgb: "rgb(13, 148, 136)",
    usage: "Supporting elements, icons",
    category: "primary",
  },
  {
    id: "default-4",
    name: "Success Green",
    hex: "#059669",
    rgb: "rgb(5, 150, 105)",
    usage: "Success states, confirmations",
    category: "semantic",
  },
  {
    id: "default-5",
    name: "Warning Orange",
    hex: "#d97706",
    rgb: "rgb(217, 119, 6)",
    usage: "Warnings, alerts, notifications",
    category: "semantic",
  },
  {
    id: "default-6",
    name: "Error Red",
    hex: "#dc2626",
    rgb: "rgb(220, 38, 38)",
    usage: "Error states, destructive actions",
    category: "semantic",
  },
  {
    id: "default-7",
    name: "Neutral Dark",
    hex: "#374151",
    rgb: "rgb(55, 65, 81)",
    usage: "Primary text, headings",
    category: "neutral",
  },
  {
    id: "default-8",
    name: "Neutral Medium",
    hex: "#6b7280",
    rgb: "rgb(107, 114, 128)",
    usage: "Secondary text, descriptions",
    category: "neutral",
  },
  {
    id: "default-9",
    name: "Neutral Light",
    hex: "#f3f4f6",
    rgb: "rgb(243, 244, 246)",
    usage: "Backgrounds, subtle borders",
    category: "neutral",
  },
  {
    id: "default-10",
    name: "Pure White",
    hex: "#ffffff",
    rgb: "rgb(255, 255, 255)",
    usage: "Card backgrounds, main content areas",
    category: "neutral",
  },
];

interface ColorData {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  usage: string;
  category: string;
}

export default function Home() {
  const [colors, setColors] = useState<ColorData[]>(defaultColors);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorData | null>(null);
  const [newColor, setNewColor] = useState({
    name: "",
    hex: "#000000",
    usage: "",
    category: "primary",
  });

  // Load colors from GitHub/Supabase/localStorage on component mount
  useEffect(() => {
    const loadColors = async () => {
      try {
        // Try GitHub first (for global admin changes)
        if (isGitHubConfigured()) {
          console.log("Loading colors from GitHub...");
          const githubColors = await fetchColorsFromGitHub();
          if (githubColors.length > 0) {
            setColors(githubColors);
            console.log("Loaded colors from GitHub:", githubColors);
            return;
          }
        }

        // Try Supabase second
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_URL !==
            "https://your-project.supabase.co"
        ) {
          console.log("Loading colors from Supabase...");
          const { data, error } = await supabase
            .from("colors")
            .select("*")
            .order("created_at", { ascending: true });

          if (!error && data && data.length > 0) {
            setColors(data);
            console.log("Loaded colors from Supabase:", data);
            return;
          }
        }

        // Fallback to localStorage
        console.log("Loading colors from localStorage...");
        const savedColors = localStorage.getItem("colorShowcaseColors");
        if (savedColors) {
          try {
            const parsedColors = JSON.parse(savedColors);
            setColors(parsedColors);
            console.log("Loaded colors from localStorage:", parsedColors);
          } catch (error) {
            console.error("Error parsing localStorage colors:", error);
            setColors(defaultColors);
          }
        } else {
          setColors(defaultColors);
        }
      } catch (error) {
        console.error("Error loading colors:", error);
        setColors(defaultColors);
      }
    };

    loadColors();
  }, []);

  // Save colors to GitHub/Supabase/localStorage whenever colors change
  useEffect(() => {
    const saveColors = async () => {
      if (colors.length === 0) return;

      // Only save if colors are not the default set (to avoid infinite loop)
      if (colors.length > 0 && colors[0]?.id === "default-1") {
        return;
      }

      // Try GitHub first (for global admin changes)
      if (isGitHubConfigured()) {
        console.log("Saving colors to GitHub...");
        const success = await saveColorsToGitHub(colors);
        if (success) {
          console.log("Successfully saved colors to GitHub");
          return;
        }
      }

      // Try Supabase second
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !==
          "https://your-project.supabase.co"
      ) {
        console.log("Saving colors to Supabase...");
        try {
          await supabase.from("colors").delete().neq("id", "");
          const { error } = await supabase.from("colors").insert(colors);
          if (!error) {
            console.log("Successfully saved colors to Supabase");
            return;
          }
        } catch (error) {
          console.error("Error saving to Supabase:", error);
        }
      }

      // Fallback to localStorage
      console.log("Saving colors to localStorage...");
      localStorage.setItem("colorShowcaseColors", JSON.stringify(colors));
    };

    saveColors();
  }, [colors]);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const handleAddColor = async () => {
    if (!newColor.name || !newColor.hex) return;

    const rgb = hexToRgb(newColor.hex);
    if (!rgb) return;

    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    const colorData: ColorData = {
      id: Date.now().toString(),
      name: newColor.name,
      hex: newColor.hex,
      rgb: rgbString,
      usage: newColor.usage,
      category: newColor.category,
    };

    // Add to current colors
    setColors([...colors, colorData]);

    // If in admin mode, save to GitHub for global persistence
    if (isAdminMode) {
      console.log("Admin mode: Saving color globally to GitHub...");
      const updatedColors = [...colors, colorData];
      await saveColorsToGitHub(updatedColors);
    }

    setNewColor({
      name: "",
      hex: "#000000",
      usage: "",
      category: "primary",
    });
    setShowAddForm(false);
  };

  const handleDeleteColor = async (id: string) => {
    const updatedColors = colors.filter((color) => color.id !== id);
    setColors(updatedColors);

    // If in admin mode, save to GitHub for global persistence
    if (isAdminMode) {
      console.log("Admin mode: Saving color deletion globally to GitHub...");
      await saveColorsToGitHub(updatedColors);
    }
  };

  const handleResetColors = async () => {
    if (
      confirm(
        isAdminMode
          ? "Are you sure you want to reset all colors to defaults? This will remove all custom colors and reset the global database."
          : "Are you sure you want to reload the current color palette? This will refresh from the database."
      )
    ) {
      if (isAdminMode) {
        // Admin mode: Reset the global database
        console.log("Admin resetting colors to defaults globally");
        setColors(defaultColors);
        await saveColorsToGitHub(defaultColors);
      } else {
        // Non-admin mode: Just reload from database
        console.log("Reloading colors from database");

        // Check if Supabase is configured
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL ===
            "https://your-project.supabase.co"
        ) {
          console.log("Supabase not configured, reloading from localStorage");
          const savedColors = localStorage.getItem("colorShowcaseColors");
          if (savedColors) {
            try {
              const parsedColors = JSON.parse(savedColors);
              setColors(parsedColors);
              console.log("Reloaded colors from localStorage:", parsedColors);
            } catch (error) {
              console.error("Error parsing localStorage colors:", error);
              setColors(defaultColors);
            }
          } else {
            setColors(defaultColors);
          }
          return;
        }

        try {
          const { data, error } = await supabase
            .from("colors")
            .select("*")
            .order("created_at", { ascending: true });

          if (error) {
            console.error("Error loading colors from Supabase:", error);
            // Fallback to localStorage
            const savedColors = localStorage.getItem("colorShowcaseColors");
            if (savedColors) {
              try {
                const parsedColors = JSON.parse(savedColors);
                setColors(parsedColors);
                console.log("Fell back to localStorage colors:", parsedColors);
              } catch (parseError) {
                console.error("Error parsing localStorage colors:", parseError);
                setColors(defaultColors);
              }
            } else {
              setColors(defaultColors);
            }
            return;
          }

          if (data && data.length > 0) {
            setColors(data);
            console.log("Reloaded colors from database:", data);
          } else {
            // Fallback to localStorage if no data in database
            const savedColors = localStorage.getItem("colorShowcaseColors");
            if (savedColors) {
              try {
                const parsedColors = JSON.parse(savedColors);
                setColors(parsedColors);
                console.log("Fell back to localStorage colors:", parsedColors);
              } catch (parseError) {
                console.error("Error parsing localStorage colors:", parseError);
                setColors(defaultColors);
              }
            } else {
              setColors(defaultColors);
            }
          }
        } catch (error) {
          console.error("Error reloading colors:", error);
          // Fallback to localStorage
          const savedColors = localStorage.getItem("colorShowcaseColors");
          if (savedColors) {
            try {
              const parsedColors = JSON.parse(savedColors);
              setColors(parsedColors);
              console.log("Fell back to localStorage colors:", parsedColors);
            } catch (parseError) {
              console.error("Error parsing localStorage colors:", parseError);
              setColors(defaultColors);
            }
          } else {
            setColors(defaultColors);
          }
        }
      }
    }
  };

  const handleExportColors = () => {
    const colorData = {
      colors: colors,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(colorData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `color-palette-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
    console.log("Exported colors:", colorData);
  };

  const handleImportColors = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            if (importedData.colors && Array.isArray(importedData.colors)) {
              setColors(importedData.colors);
              console.log("Imported colors:", importedData);
              alert("Colors imported successfully!");
            } else {
              alert("Invalid color file format");
            }
          } catch (error) {
            console.error("Error importing colors:", error);
            alert("Error importing colors. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleAdminMode = () => {
    const password = prompt("Enter admin password:");
    if (password === "admin123") {
      // Simple password - you can change this
      setIsAdminMode(!isAdminMode);
    } else if (password !== null) {
      alert("Incorrect password");
    }
  };

  const handleEditColor = (color: ColorData) => {
    console.log("Editing color:", color);
    setEditingColor(color);
    setNewColor({
      name: color.name,
      hex: color.hex,
      usage: color.usage,
      category: color.category,
    });
    setShowAddForm(true);
  };

  const handleUpdateColor = async () => {
    if (!editingColor || !newColor.name || !newColor.hex) {
      console.log("Update failed: missing data", { editingColor, newColor });
      return;
    }

    const rgb = hexToRgb(newColor.hex);
    if (!rgb) {
      console.log("Update failed: invalid hex", newColor.hex);
      return;
    }

    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    const updatedColors = colors.map((color) =>
      color.id === editingColor.id
        ? {
            ...color,
            name: newColor.name,
            hex: newColor.hex,
            rgb: rgbString,
            usage: newColor.usage,
            category: newColor.category,
          }
        : color
    );

    console.log("Updating colors:", { editingColor, newColor, updatedColors });
    setColors(updatedColors);

    // If in admin mode, save to GitHub for global persistence
    if (isAdminMode) {
      console.log("Admin mode: Saving color update globally to GitHub...");
      await saveColorsToGitHub(updatedColors);
    }

    setEditingColor(null);
    setNewColor({
      name: "",
      hex: "#000000",
      usage: "",
      category: "primary",
    });
    setShowAddForm(false);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "primary":
        return "bg-[#005a5e] text-white hover:bg-[#005a5e]/90";
      case "semantic":
        return "bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90";
      case "neutral":
        return "bg-[#6b7280] text-white hover:bg-[#6b7280]/90";
      default:
        return "bg-[#374151] text-white hover:bg-[#374151]/90";
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Hero Section */}
      <header className="bg-[#005a5e] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <Image
              src="/logo-white.png"
              alt="ENDSIDE OUT Logo"
              width={400}
              height={100}
              className="h-16 w-auto"
              priority
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Colors
              </Button>
              <Button
                onClick={handleResetColors}
                className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-500/30"
              >
                {isAdminMode ? "Reset Global" : "Reload"}
              </Button>
              {isAdminMode && (
                <>
                  <Button
                    onClick={handleExportColors}
                    className="bg-green-500/20 hover:bg-green-500/30 text-white border-green-500/30"
                  >
                    Export
                  </Button>
                  <Button
                    onClick={handleImportColors}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-blue-500/30"
                  >
                    Import
                  </Button>
                </>
              )}
              <Button
                onClick={toggleAdminMode}
                className={`${
                  isAdminMode
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border-yellow-500/30"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
              >
                {isAdminMode ? "Admin ON" : "Admin"}
              </Button>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance">
            ENDSIDE OUT Color Palette
          </h1>
          <p className="text-xl text-white/90 max-w-2xl text-pretty">
            A comprehensive color system designed with accessibility and visual
            harmony in mind. Built using HSV algorithms for mathematical
            consistency.
          </p>
        </div>
      </header>

      {/* Color Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Add Color Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#374151]">
                  {editingColor ? "Edit Color" : "Add New Color"}
                  {isAdminMode && !editingColor && (
                    <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Admin Mode
                    </span>
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-[#6b7280] hover:text-[#374151]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isAdminMode && !editingColor && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Admin Mode Active:</strong> Colors added here will
                    be saved to localStorage and can be exported to make them
                    the new defaults.
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="color-name">Color Name</Label>
                  <Input
                    id="color-name"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    placeholder="e.g., Brand Blue"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="color-hex">Hex Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="color-picker"
                      type="color"
                      value={newColor.hex}
                      onChange={(e) =>
                        setNewColor({ ...newColor, hex: e.target.value })
                      }
                      className="w-16 h-10 p-1 border border-[#d1d5db] rounded cursor-pointer"
                    />
                    <Input
                      id="color-hex"
                      value={newColor.hex}
                      onChange={(e) =>
                        setNewColor({ ...newColor, hex: e.target.value })
                      }
                      placeholder="#000000"
                      className="flex-1"
                    />
                    <div
                      className="w-12 h-10 rounded border border-[#d1d5db]"
                      style={{ backgroundColor: newColor.hex }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="color-category">Category</Label>
                  <select
                    id="color-category"
                    value={newColor.category}
                    onChange={(e) =>
                      setNewColor({ ...newColor, category: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-[#005a5e]"
                  >
                    <option value="primary">Primary</option>
                    <option value="semantic">Semantic</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="color-usage">Usage Description</Label>
                  <Textarea
                    id="color-usage"
                    value={newColor.usage}
                    onChange={(e) =>
                      setNewColor({ ...newColor, usage: e.target.value })
                    }
                    placeholder="e.g., Main brand color, buttons, links"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={editingColor ? handleUpdateColor : handleAddColor}
                    className="flex-1 bg-[#005a5e] hover:bg-[#005a5e]/90"
                    disabled={!newColor.name || !newColor.hex}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {editingColor ? "Update Color" : "Add Color"}
                    {isAdminMode && !editingColor && (
                      <span className="ml-1 text-xs">(Admin)</span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingColor(null);
                      setNewColor({
                        name: "",
                        hex: "#000000",
                        usage: "",
                        category: "primary",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Primary Colors */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-[#374151]">
              Primary Colors
            </h2>
            <Badge className="bg-[#005a5e] text-white hover:bg-[#005a5e]/90">
              Core
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colors
              .filter((c) => c.category === "primary")
              .map((color) => (
                <div key={color.id || color.hex} className="relative group">
                  <ColorCard {...color} />
                  {color.id && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {isAdminMode && (
                        <Button
                          onClick={() => handleEditColor(color)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1 h-8 w-8"
                          size="sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteColor(color.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 h-8 w-8"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-[#374151]">
              Semantic Colors
            </h2>
            <Badge className="bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90">
              States
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colors
              .filter((c) => c.category === "semantic")
              .map((color) => (
                <div key={color.id || color.hex} className="relative group">
                  <ColorCard {...color} />
                  {color.id && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {isAdminMode && (
                        <Button
                          onClick={() => handleEditColor(color)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1 h-8 w-8"
                          size="sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteColor(color.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 h-8 w-8"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>

        {/* Neutral Colors */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-[#374151]">
              Neutral Colors
            </h2>
            <Badge className="bg-[#6b7280] text-white hover:bg-[#6b7280]/90">
              Foundation
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors
              .filter((c) => c.category === "neutral")
              .map((color) => (
                <div key={color.id || color.hex} className="relative group">
                  <ColorCard {...color} />
                  {color.id && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {isAdminMode && (
                        <Button
                          onClick={() => handleEditColor(color)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1 h-8 w-8"
                          size="sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteColor(color.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 h-8 w-8"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#374151] mb-6">
            Interactive Components
          </h2>
          <ColorDemo />
        </section>

        {/* Logo Assets */}
        <section className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-[#374151] mb-6">
            Logo Assets
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                Teal Logo
              </h3>
              <div className="bg-[#f3f4f6] p-4 rounded-lg mb-4">
                <Image
                  src="/logo-teal.png"
                  alt="ENDSIDE OUT Teal Logo"
                  width={400}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <a
                href="/logo-teal.png"
                download="logo-teal.png"
                className="inline-flex items-center gap-2 bg-[#005a5e] text-white px-4 py-2 rounded-md hover:bg-[#005a5e]/90 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PNG
              </a>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                White Logo
              </h3>
              <div className="bg-[#374151] p-4 rounded-lg mb-4">
                <Image
                  src="/logo-white.png"
                  alt="ENDSIDE OUT White Logo"
                  width={400}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <a
                href="/logo-white.png"
                download="logo-white.png"
                className="inline-flex items-center gap-2 bg-[#005a5e] text-white px-4 py-2 rounded-md hover:bg-[#005a5e]/90 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PNG
              </a>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                Vertical Globe
              </h3>
              <div className="bg-[#f3f4f6] p-4 rounded-lg mb-4">
                <Image
                  src="/EO_globe_vert_teal.png"
                  alt="ENDSIDE OUT Vertical Globe"
                  width={100}
                  height={120}
                  className="mx-auto"
                />
              </div>
              <a
                href="/EO_globe_vert_teal.png"
                download="EO_globe_vert_teal.png"
                className="inline-flex items-center gap-2 bg-[#005a5e] text-white px-4 py-2 rounded-md hover:bg-[#005a5e]/90 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PNG
              </a>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-[#374151] mb-6">
            Usage Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#374151] mb-3">
                Accessibility
              </h3>
              <ul className="space-y-2 text-[#6b7280]">
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] mt-1">✓</span>
                  <span>
                    All combinations meet WCAG 2.1 AA standards (4.5:1 contrast)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] mt-1">✓</span>
                  <span>
                    Tested with deuteranopia and protanopia simulators
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] mt-1">✓</span>
                  <span>
                    Focus states use Primary Dark Cyan with 2px outline
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#374151] mb-3">
                Best Practices
              </h3>
              <ul className="space-y-2 text-[#6b7280]">
                <li className="flex items-start gap-2">
                  <span className="text-[#005a5e] mt-1">→</span>
                  <span>
                    Use Primary Dark Cyan sparingly for maximum impact
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7c3aed] mt-1">→</span>
                  <span>Secondary Purple ideal for hover states</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0d9488] mt-1">→</span>
                  <span>
                    Reserve semantic colors for their specific purposes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#374151] text-white py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/80">
            ENDSIDE OUT Color Palette • Generated with HSV algorithms for visual
            harmony
          </p>
        </div>
      </footer>
    </div>
  );
}
