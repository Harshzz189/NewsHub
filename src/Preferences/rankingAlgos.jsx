export function CategoryRanker(preferences) {
  function swap(i, j) {
    const temp = preferences[i];
    preferences[i] = preferences[j];
    preferences[j] = temp;
  }

  for (let i = 0; i < preferences.length - 1; i++) {
    let maxIndex = i;

    for (let j = i + 1; j < preferences.length; j++) {
      if (
        preferences[j].category.count >
        preferences[maxIndex].category.count
      ) {
        maxIndex = j;
      }
    }

    if (maxIndex !== i) {
      swap(i, maxIndex);
    }
  }

  return preferences;
}

export function subCategoryRanker(subCategories) {
  function swap(i, j) {
    const temp = subCategories[i];
    subCategories[i] = subCategories[j];
    subCategories[j] = temp;
  }

  for (let i = 0; i < subCategories.length - 1; i++) {
    let maxIndex = i;

    for (let j = i + 1; j < subCategories.length; j++) {
      if (
        subCategories[j].count >
        subCategories[maxIndex].count
      ) {
        maxIndex = j;
      }
    }

    if (maxIndex !== i) {
      swap(i, maxIndex);
    }
  }
  subCategories.map((obj)=>console.log({...obj}));
  return subCategories;
}