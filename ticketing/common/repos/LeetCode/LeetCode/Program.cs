using System;
using System.Collections.Generic;
using System.Linq;

namespace LeetCode
{
    class Program
    {
        /// <summary>
        /// Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that:
        /// i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
        // Notice that the solution set must not contain duplicate triplets.
        /// </summary>
        public IList<IList<int>> ThreeSum(int[] nums)
        {
            // We declare the list of lists that will contain the tripltes
            IList<IList<int>> result = new List<IList<int>>();

            //The edge case
            if (nums.Length <= 2) return result;

            Array.Sort(nums);

            // Here we declare 3 indexes. This is how it works:
            // -4 -2 -3 -1 0 0 0 2 3 10 21
            //  s  l                     r

            // s - start index. l - left index. r - right index;
            int start = 0, left, right;

            /* The target is that the number we are looking for to be composed
             * out of 2 numbers from the original array.
             * for example, if we have the startIndex at -4 we're looking for those 2 numbers
             * in the given array which, summed up will be the opposite of -4 which is 4.            */
            int target;

            // The target goes from 0 to length -2 cause:
            // // -4 -2 -3 -1 0 0 0 2 3 10 21
            //                        s  l  r
            while (start < nums.Length - 2)
            {
                target = nums[start] * -1;
                left = start + 1;
                right = nums.Length - 1;

                // Now start index is fixed and we move the left & rigt indexes to find those 2 numbers
                // which summed up will be the oppoiste of nums[s]
                while (left < right)
                {
                    // The array is sorted, so if we move left the rightIndex, the sum will decrease
                    if (nums[left] + nums[right] > target)
                    {
                        --right;
                    }

                    // Here is the opposite, it the sum of nums[l] and nums[r] is lesss than what we're looking for
                    // then we move the left index, which means that sum will increase due to the sorted array.
                    // The left index will jump to a bigger value
                    else if (nums[left] + nums[right] < target)
                    {
                        ++left;
                    }
                    // If none of those is true, then it means that nums[l] + nums[r] our desired value
                    else
                    {
                        // Here we create he solution and add it to the list of lists which contains the res
                        List<int> oneSolution = new List<int> { nums[start], nums[left], nums[right] };
                        result.Add(oneSolution);

                        // Now, in order to generate different solutions for same target, we have to jump over repetitive valuse in the arr
                        while (left < right && nums[left] == oneSolution[1]) ++left;
                        while (left < right && nums[right] == oneSolution[2]) --right;
                    }
                }
                // Now we do the same thing to start Index
                int currentStartNumber = nums[start];
                while (start < nums.Length - 2 && nums[start] == currentStartNumber) ++start;
            }
            return result;
         }
    

        public static bool IsValidSudoku(char[][] board)
        {
            HashSet<string> seen = new HashSet<string>();
            for (int i = 0; i < 9; ++i)
            {
                for (int j = 0; j < 9; ++j)
                {
                    char number = board[i][j];
                    if (number != '.')
                    {
                        if (!seen.Add(number + " in row '" + i) ||
                            !seen.Add(number + " in column " + j) ||
                            !seen.Add(number + " in block " + i / 3 + '-' + j / 3))
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        private static IEnumerable<string> FindAllSubstrings(string str)
        {
            for (int i = 0; i < str.Length; ++i)
            {
                for (int size = 1; size + i < str.Length; ++size)
                {
                    yield return str.Substring(i, size);
                }
            }
        }

        static void Main(string[] args)
        {
            var sudoku = new char[9][]
            {new char[] {'8', '3', '.', '.', '7', '.', '.', '.', '.'}
            ,new char[] {'6', '.', '.', '1', '9', '5', '.', '.', '.'}
            ,new char[]{'.', '9', '8', '.', '.', '.', '.', '6', '.'}
            ,new char[]{'8', '.', '.', '.', '6', '.', '.', '.', '3'}
            ,new char[]{'4', '.', '.', '8', '.', '3', '.', '.', '1'}
            ,new char[]{'7', '.', '.', '.', '2', '.', '.', '.', '6'}
            ,new char[]{'.', '6', '.', '.', '.', '.', '2', '8', '.'}
            ,new char[]{'.', '.', '.', '4', '1', '9', '.', '.', '5'}
            ,new char[]{'.', '.', '.', '.', '8', '.', '.', '7', '9'}};
            
            IsValidSudoku(sudoku);


            var substrings = FindAllSubstrings("abcd").ToList();
        }

    }
}