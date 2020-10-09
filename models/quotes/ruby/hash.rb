rating = { 'John Doe' => 98, 'Jane Doe' => 99, 'Jason Borne' => 100 }
operatives = ['John Doe', 'Jane Doe', 'Jason Borne']
operatives.each do |name|
	puts "Operative: #{name}, Mission Rating: #{rating[name]}"
end