import java.util.ArrayList;
import java.util.Random;

public class RandomGraph {
    Random random;

    public RandomGraph() {
        random = new Random();
    }
    
    public ArrayList<Vertex> randomVerticesMocked() {
//      int n = random.nextInt(maxSize - 2) + 3;
      ArrayList<Vertex> vertices = new ArrayList<>();
      vertices.add(new Vertex(1.5,4.5,0));
      vertices.add(new Vertex(3.3,3.1,1));
      vertices.add(new Vertex(3.5,1,2));
      vertices.add(new Vertex(2.5,-1,3));
      vertices.add(new Vertex(3.2,-3,4));
      vertices.add(new Vertex(2,-4,5));
      vertices.add(new Vertex(0.8,-3,6));
      vertices.add(new Vertex(-1.5,-4,7));
      vertices.add(new Vertex(-3.5,-2,8));
      vertices.add(new Vertex(-4,1,9));
      vertices.add(new Vertex(-1.8,1.5,10));
      vertices.add(new Vertex(-2.5,3.5,11));
      
//      vertices.add(new Vertex(5.3,-2,12));
      

      return vertices;
    }

    public ArrayList<Vertex> randomVertices(int maxSize, double maxCoord) {
        int n = random.nextInt(maxSize - 2) + 3;
        ArrayList<Vertex> vertices = new ArrayList<>();

        for (int i = 0; i < n; ++i) {
            double x = random.nextDouble() * (2 * maxCoord) - maxCoord;
            double y = random.nextDouble() * (2 * maxCoord) - maxCoord;
            vertices.add(new Vertex(x, y, i));
        }

        return vertices;
    }
}
