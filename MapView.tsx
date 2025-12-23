'use client';

import React from 'react';
import Image from 'next/image';
import { NavNode } from '@/lib/navigationGraph';
import { RouteStep } from '@/lib/pathfinding';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
    currentLocationId: string;
    route: RouteStep[];
    graph: Record<string, NavNode>;
}

export default function MapView({ currentLocationId, route, graph }: MapViewProps) {
    // Helper to get coordinates
    const getCoords = (nodeId: string) => {
        const node = graph[nodeId];
        return node?.coordinates || { x: 50, y: 50 }; // Default to center if missing
    };

    const currentCoords = getCoords(currentLocationId);

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden group">
            {/* Map Image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/campus_map_new.jpg"
                    alt="Campus Map"
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                />
                {/* Dark Overlay for better contrast */}
                <div className="absolute inset-0 bg-slate-950/30" />
            </div>

            {/* SVG Overlay for Lines/Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {route.map((step, index) => {
                    if (index === route.length - 1) return null;
                    const start = getCoords(step.nodeId);
                    const end = getCoords(route[index + 1].nodeId);
                    return (
                        <g key={index}>
                            {/* Glow Line */}
                            <line
                                x1={`${start.x}%`}
                                y1={`${start.y}%`}
                                x2={`${end.x}%`}
                                y2={`${end.y}%`}
                                stroke="#3b82f6"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeOpacity="0.3"
                            />
                            {/* Animated Dash Line */}
                            <line
                                x1={`${start.x}%`}
                                y1={`${start.y}%`}
                                x2={`${end.x}%`}
                                y2={`${end.y}%`}
                                stroke="url(#routeGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="10,10"
                                className="animate-dash"
                            >
                                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                            </line>
                        </g>
                    );
                })}
            </svg>

            {/* Nodes Markers (Only relevant ones or all?) - Let's show route nodes and current location */}
            {/* Destination Marker */}
            {
                route.length > 0 && (
                    <div
                        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${getCoords(route[route.length - 1].nodeId).x}%`, top: `${getCoords(route[route.length - 1].nodeId).y}%` }}
                    >
                        <div className="relative group/pin">
                            <MapPin className="text-red-500 w-8 h-8 drop-shadow-2xl animate-bounce" fill="#ef4444" />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-1 bg-black/50 blur-[2px] rounded-full" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover/pin:opacity-100 transition whitespace-nowrap">
                                Destination
                            </span>
                        </div>
                    </div>
                )
            }

            {/* Current Location Marker */}
            <div
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                style={{ left: `${currentCoords.x}%`, top: `${currentCoords.y}%` }}
            >
                <div className="relative flex items-center justify-center">
                    {/* Multiple ripple rings for premium feel */}
                    <div className="absolute w-16 h-16 bg-blue-500/20 rounded-full animate-ping delay-75" />
                    <div className="absolute w-10 h-10 bg-blue-400/40 rounded-full animate-pulse" />

                    {/* Core Dot */}
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10" />

                    {/* Tooltip */}
                    <div className="absolute -top-9 bg-slate-900/90 text-blue-200 text-[10px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap backdrop-blur-md border border-blue-500/30 shadow-xl">
                        You
                    </div>
                </div>
            </div>

            {/* Route Waypoints (Small dots) */}
            {
                route.map((step, idx) => {
                    // Skip start and end as they have special markers
                    if (idx === 0 || idx === route.length - 1) return null;
                    const coords = getCoords(step.nodeId);
                    return (
                        <div
                            key={idx}
                            className="absolute z-10 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-black/20"
                            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                        />
                    );
                })
            }
        </div>
    );
}
