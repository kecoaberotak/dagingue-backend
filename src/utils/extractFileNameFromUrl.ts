export const extractFileNameFromUrl = (url: string): string => {
  try {
    const matches = url.match(/(?:storage\.googleapis\.com\/[^\/]+\/)(.+)$/); // Mencari path setelah bucket
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1]); // Decode nama folder + file yang di-encode
    }
    throw new Error('File name could not be extracted from URL');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid URL format: ${error.message}`);
    }
    throw error;
  }
};
