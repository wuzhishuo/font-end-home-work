function findKthLargest(nums, k) {
  if (nums.length == 0) {
    return null;
  }

  return findKth(nums, k, 0, nums.length - 1);
}

function findKth(nums, k, start, end) {
  if (start >= end) {
    return start + 1 == k ? nums[start] : null;
  }

  let index = partition(nums, start, end);
  if (index + 1 == k) {
    return nums[index];
  } else if (k < index + 1) {
    return findKth(nums, k, start, index - 1);
  } else {
    return findKth(nums, k, index + 1, end);
  }
}

function partition(nums, start, end) {
  let i = start;
  let j = start;

  for (i; i <= end - 1; i++) {
    if (nums[i] < nums[end]) {
      let temp = nums[j];
      nums[j] = nums[i];
      nums[i] = temp;
      j++;
    }
  }

  let temp = nums[end];
  nums[end] = nums[j];
  nums[j] = temp;
  return j;
}

let test = [1, 3, 2, 5, 6];
console.log(findKthLargest(test, 3));
