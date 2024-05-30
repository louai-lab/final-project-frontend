const ClearCache = async () => {
  try {
    await caches.delete("Lebanese-association-football-in-the-north");

    console.log("Cache cleared successfully");
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

export { ClearCache };
