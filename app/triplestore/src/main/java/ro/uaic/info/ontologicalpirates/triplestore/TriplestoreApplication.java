package ro.uaic.info.ontologicalpirates.triplestore;

import org.apache.jena.base.Sys;
import org.apache.jena.fuseki.Fuseki;
import org.apache.jena.fuseki.main.FusekiServer;
import org.apache.jena.fuseki.server.DataService;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.rdfconnection.RDFConnection;
import org.apache.jena.sparql.core.DatasetGraph;
import org.apache.jena.sparql.core.DatasetGraphFactory;
import org.apache.jena.tdb.TDBFactory;
import org.apache.jena.tdb.TDBLoader;
import org.apache.jena.tdb.store.DatasetGraphTDB;
import org.apache.jena.update.UpdateAction;
import org.apache.jena.update.UpdateFactory;
import org.apache.jena.update.UpdateRequest;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class TriplestoreApplication  {

	private static FusekiServer server;

	public static void main(String[] args) {
		SpringApplication.run(TriplestoreApplication.class, args);
		System.out.println("Hello there");
	}

	@PostConstruct
	public void setup() {
		Dataset ds = DatasetFactory.createTxnMem();
		try (RDFConnection conn = RDFConnection.connect(ds)) {
			conn.load("crykv3.ttl") ;
		}
		server = FusekiServer.create()
						.port(3332)
						.add("/ds", ds)
						.build();
		server.start();

	}

}
