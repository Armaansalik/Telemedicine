import React, { useState } from 'react';
import { Heart, Users, Baby, Shield, Phone, Mail } from 'lucide-react';
import { healthSchemes } from '../data/healthSchemes';
import { hospitals } from '../data/hospitals';
import { HealthScheme, Hospital } from '../types';

interface HealthSchemesProps {
  language: 'en' | 'pa';
}

export const HealthSchemes: React.FC<HealthSchemesProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<HealthScheme | null>(null);

  const categories = [
    { id: 'all', name: language === 'pa' ? 'ਸਾਰੀਆਂ' : 'All', icon: Heart },
    { id: 'maternal', name: language === 'pa' ? 'ਮਾਤਰਿਤਵ' : 'Maternal', icon: Baby },
    { id: 'child', name: language === 'pa' ? 'ਬਾਲ ਸਿਹਤ' : 'Child Health', icon: Users },
    { id: 'general', name: language === 'pa' ? 'ਆਮ' : 'General', icon: Heart },
    { id: 'insurance', name: language === 'pa' ? 'ਬੀਮਾ' : 'Insurance', icon: Shield }
  ];

  const filteredSchemes = selectedCategory === 'all' 
    ? healthSchemes 
    : healthSchemes.filter(scheme => scheme.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maternal': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'child': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'general': return 'bg-green-100 text-green-800 border-green-200';
      case 'insurance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'pa' ? 'ਪੰਜਾਬ ਸਰਕਾਰ ਸਿਹਤ ਯੋਜਨਾਵਾਂ' : 'Punjab Government Health Schemes'}
            </h1>
            <p className="text-gray-600">
              {language === 'pa' 
                ? 'ਸਿਹਤ ਵਿਭਾਗ, ਪੰਜਾਬ ਸਰਕਾਰ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਯੋਜਨਾਵਾਂ'
                : 'Health schemes operated by Health Department, Government of Punjab'
              }
            </p>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-900">
                  {language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਐਂਬੂਲੈਂਸ' : 'Emergency Ambulance'}
                </h3>
                <p className="text-red-700 text-xl font-bold">108</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  {language === 'pa' ? 'ਸਿਹਤ ਹੈਲਪਲਾਈਨ' : 'Health Helpline'}
                </h3>
                <p className="text-blue-700 text-xl font-bold">104</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-orange-100 text-orange-800 border-orange-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedScheme(scheme)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {language === 'pa' ? scheme.nameInPunjabi : scheme.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(scheme.category)}`}>
                  {scheme.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {language === 'pa' ? scheme.descriptionInPunjabi : scheme.description}
              </p>
              <div className="text-sm">
                <p className="text-gray-700 mb-2">
                  <strong>{language === 'pa' ? 'ਯੋਗਤਾ:' : 'Eligibility:'}</strong>
                </p>
                <p className="text-gray-600 line-clamp-2">
                  {language === 'pa' ? scheme.eligibilityInPunjabi : scheme.eligibility}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hospitals List */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'pa' ? 'ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਅਤੇ ਸਿਹਤ ਕੇਂਦਰ' : 'Government Hospitals & Health Centers'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'pa' ? 'ਸੰਸਥਾ ਦਾ ਨਾਮ' : 'Institution Name'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'pa' ? 'ਫੋਨ' : 'Phone'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'pa' ? 'ਈਮੇਲ' : 'Email'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'pa' ? 'ਕਿਸਮ' : 'Type'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                    <div className="text-sm text-gray-500">{hospital.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {hospital.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {hospital.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {hospital.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'pa' ? selectedScheme.nameInPunjabi : selectedScheme.name}
                </h2>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'pa' ? 'ਵਰਣਨ:' : 'Description:'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'pa' ? selectedScheme.descriptionInPunjabi : selectedScheme.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'pa' ? 'ਯੋਗਤਾ:' : 'Eligibility:'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'pa' ? selectedScheme.eligibilityInPunjabi : selectedScheme.eligibility}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'pa' ? 'ਲਾਭ:' : 'Benefits:'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'pa' ? selectedScheme.benefitsInPunjabi : selectedScheme.benefits}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {language === 'pa' 
                    ? 'ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਲਈ ਵੈਬਸਾਈਟ ਦੇਖੋ: '
                    : 'For more details visit: '
                  }
                  <a 
                    href="https://health.punjab.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    health.punjab.gov.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};