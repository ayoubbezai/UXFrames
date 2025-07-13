import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_BG = "bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900";
const SIDEBAR_BORDER = "border-r border-blue-900/30";
const SIDEBAR_SHADOW = "shadow-2xl";
const ACTIVE_BG = "bg-blue-600/90 text-white";
const HOVER_BG = "hover:bg-blue-700/70 hover:text-white";
const ICON_COLOR = "text-blue-200 group-hover:text-white";
const ACTIVE_ICON = "text-white";
const USER_BG = "bg-gradient-to-br from-blue-500 to-blue-700";
const USER_TEXT = "text-white";

const APP_NAME = "uxframes";
const APP_LOGO = APP_NAME.slice(0, 2).toUpperCase();

const Sidebar = ({ currentPage, setCurrentPage, expanded, setExpanded }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      id: "screens",
      name: "Screens",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18" />
        </svg>
      ),
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      id: "library",
      name: "Component Library",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
    },
    {
      id: "settings",
      name: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.aside
      initial={{ width: expanded ? 208 : 60 }}
      animate={{ width: expanded ? 208 : 60 }}
      transition={{ type: "spring", damping: 12, stiffness: 320, mass: 0.6 }}
      className={`h-screen ${SIDEBAR_BG} ${SIDEBAR_BORDER} flex flex-col justify-between relative overflow-hidden transition-all duration-100 ${SIDEBAR_SHADOW} ${expanded ? 'w-52 min-w-[208px]' : 'min-w-[60px] w-[60px]'}`}
    >
      <div>
        <motion.div
          className="flex items-center gap-3 px-6 py-5 border-b border-blue-900/20 relative"
          whileHover={{ backgroundColor: "rgba(30, 64, 175, 0.04)" }}
        >
          <div className={`w-9 h-9 rounded-full ${USER_BG} flex items-center justify-center font-bold text-lg shrink-0 ${USER_TEXT} shadow-md`}>{APP_LOGO}</div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold tracking-tight text-white whitespace-nowrap drop-shadow"
              >
                {APP_NAME}
              </motion.span>
            )}
          </AnimatePresence>
          {/* Always show the expand/collapse button, positioned absolutely to the right */}
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-800/80 border border-blue-900/40 rounded-full p-1.5 text-blue-200 hover:text-white hover:bg-blue-700/90 shadow transition-colors z-10"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            tabIndex={0}
          >
            {expanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>
        </motion.div>

        <nav className="mt-4 flex-1 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <motion.li
                key={item.id}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <button
                  className={`flex items-center w-full px-3 py-2.5 text-left rounded-lg transition-all duration-200 group relative overflow-hidden ${currentPage === item.id
                    ? ACTIVE_BG
                    : HOVER_BG
                    }`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <span
                    className={`shrink-0 ${currentPage === item.id ? ACTIVE_ICON : ICON_COLOR}`}
                  >
                    {item.icon}
                  </span>
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={`text-sm ml-3 text-white whitespace-nowrap ${currentPage === item.id ? "font-bold" : ""}`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {currentPage === item.id && (
                    <motion.span
                      className="absolute right-3 w-1.5 h-1.5 bg-white/90 rounded-full shadow"
                      layoutId="activeIndicator"
                    />
                  )}
                  {hoveredItem === item.id && currentPage !== item.id && (
                    <motion.span
                      className="absolute inset-0 bg-blue-700/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="px-3 py-3 border-t border-blue-900/20 bg-gradient-to-t from-blue-900/10 to-transparent">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 ${USER_BG} rounded-full flex items-center justify-center text-sm font-medium ${USER_TEXT} border shrink-0 shadow`}>A</div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <div className="text-sm font-medium text-white truncate drop-shadow">Admin User</div>
                <div className="text-xs text-blue-200 truncate">Administrator</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;