import React, { useState, useEffect } from 'react';

const PhilippinesAddressLookup = ({ 
    formData, 
    setFormData, 
    isDisabled = false
}) => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [loading, setLoading] = useState({
        regions: false,
        provinces: false,
        cities: false,
        barangays: false
    });

    // Load regions on component mount
    useEffect(() => {
        loadRegions();
    }, []);

    // Load provinces when region changes
    useEffect(() => {
        if (formData.region_id) {
            // Find the selected region to get its region_id field
            const selectedRegion = regions.find(r => r.id.toString() === formData.region_id.toString());
            if (selectedRegion && selectedRegion.region_id) {
                loadProvinces(selectedRegion.region_id);
            }
        } else {
            setProvinces([]);
            setCities([]);
            setBarangays([]);
            setFormData(prev => ({
                ...prev,
                province_id: null,
                city_id: null,
                barangay_id: null,
                province: '',
                city: '',
                barangay: ''
            }));
        }
    }, [formData.region_id, regions]);

    // Load cities when province changes
    useEffect(() => {
        if (formData.province_id) {
            // Find the selected province to get its province_id field
            const selectedProvince = provinces.find(p => p.id.toString() === formData.province_id.toString());
            if (selectedProvince && selectedProvince.province_id) {
                loadCities(selectedProvince.province_id);
            }
        } else {
            setCities([]);
            setBarangays([]);
            setFormData(prev => ({
                ...prev,
                city_id: null,
                barangay_id: null,
                city: '',
                barangay: ''
            }));
        }
    }, [formData.province_id, provinces]);

    // Load barangays when city changes
    useEffect(() => {
        if (formData.city_id) {
            // Find the selected city to get its city_id field
            const selectedCity = cities.find(c => c.id.toString() === formData.city_id.toString());
            if (selectedCity && selectedCity.city_id) {
                loadBarangays(selectedCity.city_id);
            }
        } else {
            setBarangays([]);
            setFormData(prev => ({
                ...prev,
                barangay_id: null,
                barangay: ''
            }));
        }
    }, [formData.city_id, cities]);

    const loadRegions = async () => {
        setLoading(prev => ({ ...prev, regions: true }));
        try {
            const response = await fetch('/api/address/regions');
            if (!response.ok) {
                throw new Error('Failed to fetch regions');
            }
            const data = await response.json();
            console.log('Regions data:', data); // Debug log
            setRegions(data);
        } catch (error) {
            console.error('Error loading regions:', error);
        } finally {
            setLoading(prev => ({ ...prev, regions: false }));
        }
    };

    const loadProvinces = async (regionId) => {
        setLoading(prev => ({ ...prev, provinces: true }));
        try {
            const response = await fetch(`/api/address/provinces/${regionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch provinces');
            }
            const data = await response.json();
            console.log('Provinces data:', data); // Debug log
            setProvinces(data);
        } catch (error) {
            console.error('Error loading provinces:', error);
        } finally {
            setLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const loadCities = async (provinceId) => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
            const response = await fetch(`/api/address/cities/${provinceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }
            const data = await response.json();
            console.log('Cities data:', data); // Debug log
            setCities(data);
        } catch (error) {
            console.error('Error loading cities:', error);
        } finally {
            setLoading(prev => ({ ...prev, cities: false }));
        }
    };

    const loadBarangays = async (cityId) => {
        setLoading(prev => ({ ...prev, barangays: true }));
        try {
            const response = await fetch(`/api/address/barangays/${cityId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch barangays');
            }
            const data = await response.json();
            console.log('Barangays data:', data); // Debug log
            setBarangays(data);
        } catch (error) {
            console.error('Error loading barangays:', error);
        } finally {
            setLoading(prev => ({ ...prev, barangays: false }));
        }
    };

    const handleRegionChange = (regionId) => {
        const selectedRegion = regions.find(r => r.id.toString() === regionId);
        setFormData(prev => ({
            ...prev,
            region_id: regionId,
            region: selectedRegion?.name || '',
            province_id: null,
            city_id: null,
            barangay_id: null,
            province: '',
            city: '',
            barangay: ''
        }));
    };

    const handleProvinceChange = (provinceId) => {
        const selectedProvince = provinces.find(p => p.id == provinceId);
        setFormData(prev => ({
            ...prev,
            province_id: provinceId,
            province: selectedProvince?.name || '',
            city_id: null,
            barangay_id: null,
            city: '',
            barangay: ''
        }));
    };

    const handleCityChange = (cityId) => {
        const selectedCity = cities.find(c => c.id == cityId);
        setFormData(prev => ({
            ...prev,
            city_id: cityId,
            city: selectedCity?.name || '',
            barangay_id: null,
            barangay: ''
        }));
    };

    const handleBarangayChange = (barangayId) => {
        const selectedBarangay = barangays.find(b => b.id == barangayId);
        setFormData(prev => ({
            ...prev,
            barangay_id: barangayId,
            barangay: selectedBarangay?.name || ''
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="grid grid-cols-4 gap-6">
            {/* Region */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Region *</label>
                <select 
                    value={formData.region_id?.toString() || ''}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    disabled={isDisabled || loading.regions}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                    <option value="">
                        {loading.regions ? 'Loading regions...' : 'Select Region'}
                    </option>
                    {regions.map((region) => (
                        <option key={region.id} value={region.id.toString()}>
                            {region.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Province */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Province *</label>
                <select 
                    value={formData.province_id?.toString() || ''}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    disabled={isDisabled || loading.provinces || !formData.region_id}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                    <option value="">
                        {loading.provinces ? 'Loading provinces...' : !formData.region_id ? 'Select Region first' : 'Select Province'}
                    </option>
                    {provinces.map((province) => (
                        <option key={province.id} value={province.id.toString()}>
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* City/Municipality */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <select 
                    value={formData.city_id?.toString() || ''}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={isDisabled || loading.cities || !formData.province_id}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                    <option value="">
                        {loading.cities ? 'Loading cities...' : !formData.province_id ? 'Select Province first' : 'Select City'}
                    </option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id.toString()}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Barangay */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Barangay *</label>
                <select 
                    value={formData.barangay_id?.toString() || ''}
                    onChange={(e) => handleBarangayChange(e.target.value)}
                    disabled={isDisabled || loading.barangays || !formData.city_id}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                    <option value="">
                        {loading.barangays ? 'Loading barangays...' : !formData.city_id ? 'Select City first' : 'Select Barangay'}
                    </option>
                    {barangays.map((barangay) => (
                        <option key={barangay.id} value={barangay.id.toString()}>
                            {barangay.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PhilippinesAddressLookup;
