import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useVariant(variants) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialColour = () => {
    const fromUrl = searchParams.get('colour');
    if (fromUrl && variants.find((v) => v.colour === fromUrl)) return fromUrl;
    return variants[0]?.colour ?? '';
  };

  const getInitialSize = (colour) => {
    const fromUrl = searchParams.get('size');
    const colourData = variants.find((v) => v.colour === colour);
    if (!colourData) return '';
    if (fromUrl && colourData.sizes.find((s) => s.size === fromUrl)) return fromUrl;
    // default to first available size
    const available = colourData.sizes.find((s) => s.status !== 'sold-out');
    return available?.size ?? colourData.sizes[0]?.size ?? '';
  };

  const [selectedColour, setSelectedColour] = useState(() =>
    variants.length ? getInitialColour() : ''
  );
  const [selectedSize, setSelectedSize] = useState(() =>
    variants.length ? getInitialSize(getInitialColour()) : ''
  );

  // Sync to URL whenever selection changes
  useEffect(() => {
    if (!selectedColour && !selectedSize) return;
    const params = {};
    if (selectedColour) params.colour = selectedColour;
    if (selectedSize)   params.size   = selectedSize;
    setSearchParams(params, { replace: true });
  }, [selectedColour, selectedSize]); // eslint-disable-line

  const selectColour = useCallback(
    (colour) => {
      setSelectedColour(colour);
      // When colour changes, reset size to first available for that colour
      const colourData = variants.find((v) => v.colour === colour);
      if (colourData) {
        const available = colourData.sizes.find((s) => s.status !== 'sold-out');
        setSelectedSize(available?.size ?? colourData.sizes[0]?.size ?? '');
      }
    },
    [variants]
  );

  const selectSize = useCallback((size) => setSelectedSize(size), []);

  // Current colour data
  const colourData = variants.find((v) => v.colour === selectedColour);
  const sizeData   = colourData?.sizes.find((s) => s.size === selectedSize);
  const isSoldOut  = sizeData?.status === 'sold-out';
  const isLowStock = sizeData?.status === 'low-stock';

  return {
    selectedColour,
    selectedSize,
    colourData,
    sizeData,
    isSoldOut,
    isLowStock,
    selectColour,
    selectSize,
  };
}
