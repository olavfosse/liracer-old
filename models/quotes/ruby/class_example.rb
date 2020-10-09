class Shipment
  attr_accessor :shipment_type, :item_count, :ship_date
  def initialize(shipment_type:, ship_date:)
    @contents = Hash.new
    @item_count = 0
    @ship_date = ship_date
    @shipment_type = shipment_type
    @weight = 0
  end

  def add(item)
    if @contents.has_key?(item)
      @contents[item] += 1
    else
      @contents[item] = 1
    end
    @item_count +=1
  end
end