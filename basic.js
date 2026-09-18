function loopSimult(A) {
  if (!Array.isArray(A) || A.length === 0) {
    return [];
  }

  const result = [];
  const length = A[0].length;

  for (let i = 0; i < length; i++) {
    let combined = "";

    for (let j = 0; j < A.length; j++) {
      combined += A[j][i];
    }

    result.push(combined);
  }

  return result;
}
