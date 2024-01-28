import java.util.*;
public class Main {
    public static List<Integer> findIndices(int[] values, int sum) {
        int n = values.length;
        int[] dp = new int[sum + 1];
        int[] index = new int[sum + 1];

        Arrays.fill(dp, Integer.MIN_VALUE);
        dp[0] = 0;

        for (int i = 0; i < n; i++) {
            for (int j = values[i]; j <= sum; j++) {
                if (dp[j - values[i]] + 1 > dp[j]) {
                    dp[j] = dp[j - values[i]] + 1;
                    index[j] = i;
                }
            }
        }
        Set<Integer> addedIndices = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        int remainingSum = sum;

        while (remainingSum > 0) {
            int usedIndex = index[remainingSum];

            // Add the index only if it hasn't been added before
            if (!addedIndices.contains(usedIndex)) {
                result.add(values[usedIndex]);
                addedIndices.add(usedIndex);
            }

            remainingSum -= values[usedIndex];
        }

         Collections.sort(result);
         return result;

    }

    public static void main(String[] args) {
        int[] arr = {2 ,7, 3 ,4,9};
        int sum = 13;
        Map<Integer, Integer> frequencyMap = new HashMap<>();
        for (int num : arr) {
            frequencyMap.put(num, frequencyMap.getOrDefault(num, 0) + 1);
        }
        // Custom comparator for sorting based on frequency and then element value
        Integer[] boxedArr = Arrays.stream(arr).boxed().toArray(Integer[]::new);
        Arrays.sort(boxedArr, new Comparator<Integer>() {
            @Override
            public int compare(Integer a, Integer b) {
                int freqComparison = Integer.compare(frequencyMap.get(b), frequencyMap.get(a));
                return (freqComparison == 0) ? Integer.compare(Arrays.asList(arr).indexOf(a), Arrays.asList(arr).indexOf(b)) : freqComparison;
            }
        });

        // Convert back to primitive array
        int[] sortedArr = Arrays.stream(boxedArr).mapToInt(Integer::intValue).toArray();
        
        List<Integer> indices = findIndices(sortedArr, sum);
        if(indices.size()==0){
            System.out.println("Impossible");
        }
        else if(indices.size()==1&&sum%indices.get(0)!=0){
            System.out.println("Impossible");
        }
        else{
            // System.out.println("Indices of elements used to make the sum " + sum + ": " + indices);
            for (int index : indices) {
                System.out.print(index + " ");
            }
        }
       
    }
}
