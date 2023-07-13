export default (website: string) => {
  website = website.toLowerCase().replaceAll(' ', '').replace('http://', '').replace('https://', '').replace('www.', '');
  return website.split('/')[0];
};
