<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<script type="text/javascript" src="./jquery/dist/jquery.js"></script>

<style type="text/css">
table {
	margin: 0 auto;
}

td {
	text-align: center;
	padding: 0 10px;
}

td.red {
	color: red;
	font-weight: bold;
}

td.blue {
	color: blue;
	font-weight: bold;
}
</style>

</head>
<body>
	<table>
		<% data.forEach(function(o) { %>
		<tr>
			<td><%='第' + o.PHASE_NUM + '期' %></td>
			<td><%=o.PUBLISH_TIME.getFullYear() + '年' + (o.PUBLISH_TIME.getMonth() + 1) + '月' + o.PUBLISH_TIME.getDate() + '日' %></td>
			<td class='red'><%=o.RED_1 %></td>
			<td class='red'><%=o.RED_2 %></td>
			<td class='red'><%=o.RED_3 %></td>
			<td class='red'><%=o.RED_4 %></td>
			<td class='red'><%=o.RED_5 %></td>
			<td class='red'><%=o.RED_6 %></td>
			<td class='blue'><%=o.BLUE %></td>
		</tr>
		<% }); %>
	</table>
</body>
</html>