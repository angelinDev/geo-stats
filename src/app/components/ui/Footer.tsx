import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section principale */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">GeoStats</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explorez les données économiques mondiales à travers une interface interactive moderne. 
              Visualisez le PIB, l'espérance de vie, et d'autres indicateurs clés par pays.
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Fonctionnalités</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Carte interactive mondiale</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Données économiques en temps réel</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Visualisations D3.js avancées</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Interface responsive</span>
              </li>
            </ul>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 text-blue-400 text-xs font-medium rounded-full border border-gray-700">
                Next.js
              </span>
              <span className="px-3 py-1 bg-gray-800 text-blue-400 text-xs font-medium rounded-full border border-gray-700">
                React
              </span>
              <span className="px-3 py-1 bg-gray-800 text-blue-400 text-xs font-medium rounded-full border border-gray-700">
                D3.js
              </span>
              <span className="px-3 py-1 bg-gray-800 text-blue-400 text-xs font-medium rounded-full border border-gray-700">
                TypeScript
              </span>
              <span className="px-3 py-1 bg-gray-800 text-blue-400 text-xs font-medium rounded-full border border-gray-700">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 bg-gray-800 text-blue-400 text-xs font-medium rounded-full border border-gray-700">
                TopoJSON
              </span>
            </div>
            <div className="pt-4">
              <p className="text-xs text-gray-500">
                Développé par José-Marie L.
              </p>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 GeoStats. Données basées sur les APIs publiques de la Banque Mondiale.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>! Données manquantes</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Mode sombre exclusif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
