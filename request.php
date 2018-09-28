<?php
	$servername = "localhost";
	$username = "root";  //your user name for php my admin if in local most probaly it will be "root"
	$password = "";  //password probably it will be empty
	$databasename = "orar"; //db name
	// Create connection
	$conn = new mysqli($servername, $username, $password, $databasename);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: ".  $conn->connect_error);
	} 

	if (isset($_REQUEST["profile"])) {
		$profile = $_REQUEST["profile"];
		if ($profile != "") {
			$profile_query = "SELECT DISTINCT profil FROM cursuri";

			$query_result = $conn->query($profile_query);
			$result = "";

			while ($row = $query_result->fetch_assoc()) {
				if ($result === "") {
					$result = $row['profil'];
				}
				else {
					$result .= ", ";
					$result .= $row['profil'];
				}
			}
			echo $result;
		}
	}
	

	if (isset($_REQUEST["language"])) {
		$requested_profile = $_REQUEST["language"];

		if ($requested_profile != "") {
			$language_query = "SELECT DISTINCT limba FROM cursuri WHERE profil='$requested_profile'";

			$query_result = $conn->query($language_query);
			$result = "";

			while ($row = $query_result->fetch_assoc()) {
				if ($result === "") {
					$result = $row['limba'];
				}
				else {
					$result .= ", ";
					$result .= $row['limba'];
				}
			}
			echo $result;
		}	
	}
	

	if (isset($_REQUEST["specializare"])) {
		$requested_spec = $_REQUEST["specializare"];
		$requested_spec = explode(",", $requested_spec);

		$requested_profile = $requested_spec[0];
		$requested_language = $requested_spec[1];

		if ($requested_language != "" && $requested_profile != "") {
			$year_query = "SELECT DISTINCT an FROM CURSURI WHERE profil='$requested_profile' AND limba='$requested_language'";

			$query_result = $conn->query($year_query);
			$result = "";

			while ($row = $query_result->fetch_assoc()) {
				if ($result === "") {
					$result = $row['an'];
				}
				else {
					$result .= ", ";
					$result .= $row['an'];
				}
			}
			echo $result;			
		}
	}

	if (isset($_REQUEST["specAndYear"])) {
		$requested_spec = $_REQUEST["specAndYear"];
		$requested_spec = explode(",", $requested_spec);

		$requested_profile = $requested_spec[0];
		$requested_language = $requested_spec[1];
		$requested_year = $requested_spec[2];

		if ($requested_language != "" && $requested_profile != "" && $requested_year != "") {
			$group_query = "SELECT DISTINCT formatia 
							FROM CURSURI 
							WHERE profil='$requested_profile' AND limba='$requested_language' AND an='$requested_year' 
							AND formatia NOT LIKE '___/%' AND formatia NOT LIKE 'I%' AND formatia NOT LIKE 'M%'";

			$query_result = $conn->query($group_query);
			$result = "";

			while ($row = $query_result->fetch_assoc()) {
				if ($result === "") {
					$result = $row['formatia'];
				}
				else {
					$result .= ", ";
					$result .= $row['formatia'];
				}
			}
			echo $result;			
		}
	}

	if (isset($_REQUEST["data"])) {
		$requested_data = $_REQUEST["data"];
		$requested_data = explode(",", $requested_data);

		$requested_profile = $requested_data[0];
		$requested_language = $requested_data[1];
		$requested_year = $requested_data[2];
		$requested_group = $requested_data[3];

		if ($requested_profile != "" && $requested_language != "" && $requested_year != "" && $requested_group != "") {
			$whole_group = substr("$requested_group", 0, 3);
			$schedule_query = "SELECT DISTINCT profil, limba, an, ziua, orele, frecventa, sala, formatia, tipul, disciplina, profesor
							   FROM CURSURI
	   						   WHERE profil='$requested_profile' AND limba='$requested_language' AND an='$requested_year' AND
							   (formatia='$requested_group' OR formatia LIKE 'I%' 
							   		OR formatia LIKE 'M%' OR formatia = '$whole_group')
							   ORDER BY
									CASE
									  WHEN ziua = 'Luni' THEN 1
									  WHEN ziua = 'Marti' THEN 2
									  WHEN ziua = 'Miercuri' THEN 3
									  WHEN ziua = 'Joi' THEN 4
									  WHEN ziua = 'Vineri' THEN 5
									END,
									CASE
									  WHEN orele = '8-10' THEN 1
									  WHEN orele = '10-12' THEN 2
									  WHEN orele = '12-14' THEN 3
									  WHEN orele = '14-16' THEN 4
									  WHEN orele = '16-18' THEN 5
									  WHEN orele = '18-20' THEN 6
									END";


			$query_result = $conn->query($schedule_query);
			$result = "";


			while ($row = mysqli_fetch_row($query_result)) {
				if ($result === "") {
					foreach($row as $field) {
						$result .= $field;
						$result .= ',';
					}

				}
				else {
					$result .= ";";
					foreach($row as $field) {
						$result .= $field;
						$result .= ',';
					}
				}
			}
			echo $result;
		}
	}
?>