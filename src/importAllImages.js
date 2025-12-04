const cakeImages = import.meta.glob('../src/Images/Cakes/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const flowerImages = import.meta.glob('../src/Images/Flowers/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const addonsImages = import.meta.glob('../src/Images/Addons/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const images = {};

const addToImages = (raw) => {
  for (const path in raw) {
    const fileKey = path.split('/').pop().split('.')[0].toUpperCase();
    images[fileKey] = raw[path];
  }
};

addToImages(cakeImages);
addToImages(flowerImages);
addToImages(addonsImages);
export default images;
